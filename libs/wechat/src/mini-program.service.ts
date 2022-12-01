import { LoggerService } from '@/common/logger/logger.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch';
import type {
  ReplySubscribeMessageRequest,
  WechatBaseResponse,
  WechatCheckSignatureRequest,
  WechatCode2sessionResponse,
  WechatGetAccessTokenResponse,
  WechatGetUnlimitedQRCodeRequest,
  WechatMiniProgramMessageRequest,
} from '@/typings/wechat';
import { CacheService } from '@/common/cache/cache.service';
import { checkRedisResult } from '@/constants/constants';
import dayjs from 'dayjs';
import { sha1 } from '@powerfulyang/node-utils';
import crypto from 'crypto';
import { WeatherService } from '@app/weather';

@Injectable()
export class MiniProgramService {
  static Key = 'mini_program_access_token';

  private readonly appId = process.env.WECHAT_MINI_APP_ID;

  private readonly appSecret = process.env.WECHAT_MINI_APP_SECRET;

  constructor(
    private readonly logger: LoggerService,
    private readonly cacheService: CacheService,
    private readonly weatherService: WeatherService,
  ) {
    this.logger.setContext(MiniProgramService.name);
    if (this.appId && this.appSecret) {
      this.getAccessToken().catch((e) => {
        this.logger.error(e);
      });
    }
  }

  async getAccessToken() {
    const accessToken = await this.cacheService.get(MiniProgramService.Key);
    if (accessToken) {
      return accessToken;
    }
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`;
    const res = await fetch(url);
    const json = (await res.json()) as WechatGetAccessTokenResponse;
    if (json.errcode) {
      this.logger.error(`getAccessToken error: ${json.errmsg}`);
      throw new Error(json.errmsg);
    }
    this.logger.info(
      `access_token will be expired at ${dayjs()
        .add(json.expires_in, 'second')
        .format('YYYY-MM-DD HH:mm:ss')}`,
    );
    const result = await this.cacheService.set(
      MiniProgramService.Key,
      json.access_token,
      'EX',
      json.expires_in,
    );
    checkRedisResult(result);
    this.logger.debug(`access_token: ${json.access_token}, expires_in: ${json.expires_in}`);
    return json.access_token;
  }

  async code2session(code: string) {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${this.appId}&secret=${this.appSecret}&js_code=${code}&grant_type=authorization_code`;
    const res = await fetch(url);
    const json = (await res.json()) as WechatCode2sessionResponse;
    if (json.errcode) {
      throw new InternalServerErrorException(json.errmsg);
    }
    this.logger.debug(
      `openid: ${json.openid}, session_key: ${json.session_key}, unionid: ${json.unionid || ''}`,
    );
    return null;
  }

  async getUnlimitedQRCode(options: WechatGetUnlimitedQRCodeRequest) {
    const accessToken = await this.getAccessToken();
    const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`;
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(options),
    });
    const contentType = res.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const json = await res.json();
      throw new InternalServerErrorException(json.errmsg);
    }
    return res;
  }

  checkSignature(query: WechatCheckSignatureRequest) {
    const { signature, timestamp, nonce, echostr } = query;
    const token = process.env.WECHAT_MINI_APP_TOKEN;
    const arr = [token, timestamp, nonce].sort();
    const sha1Str = sha1(arr.join(''));
    if (sha1Str === signature) {
      return echostr;
    }
    throw new InternalServerErrorException('checkSignature error');
  }

  decryptData(encryptedData: string) {
    const key = process.env.WECHAT_MINI_APP_AES_KEY;
    if (!key) {
      throw new InternalServerErrorException('WECHAT_MINI_APP_AES_KEY is not defined');
    }
    const aesKey = Buffer.from(key, 'base64');
    const iv = aesKey.slice(0, 16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
    decipher.setAutoPadding(false);
    return decipher.update(encryptedData, 'base64', 'utf8');
  }

  subscribeMessage(request: WechatMiniProgramMessageRequest) {
    const decryptData = this.decryptData(request.Encrypt);
    const lastChar = decryptData[decryptData.length - 1];
    // drop random string
    let str = decryptData.slice(16);
    // drop control characters
    str = str.replaceAll(lastChar, '');
    // extract corpId
    const corpId = str.slice(-18);
    // drop head four characters
    const jsonStr = str.slice(4, -18);
    const json = JSON.parse(jsonStr);
    this.logger.debug(`corpId: ${corpId}\nsubscribeMessage:\n${JSON.stringify(json, null, 2)}`);
  }

  async replySubscribeMessage(request: ReplySubscribeMessageRequest) {
    const accessToken = await this.getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`;
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    const json = (await res.json()) as WechatBaseResponse;
    if (json.errcode) {
      this.logger.error(`replySubscribeMessage error: ${json.errmsg}`);
      throw new Error(json.errmsg);
    }
    return json;
  }

  /**
   * @description 发送天气预报订阅消息
   * @param toUser - 接收者（用户）的 openid
   */
  async replyTodayWeather(toUser: string) {
    const weather = await this.weatherService.getTodayWeather();
    return this.replySubscribeMessage({
      touser: toUser,
      template_id: 'k-EspzqmrO2YOZ9ZQCEKwA5ptCYXjQits4k-aJeokaw',
      page: 'pages/index/index',
      miniprogram_state: 'trial',
      data: {
        phrase2: {
          value: weather.city,
        },
        date1: {
          value: dayjs().format('YYYY-MM-DD'),
        },
        phrase3: {
          value: weather.weather,
        },
        character_string4: {
          value: `${weather.temperature}℃`,
        },
        thing5: {
          value: weather.description,
        },
      },
    });
  }
}
