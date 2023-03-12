import type { LoggerService } from '@/common/logger/logger.service';
import { InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch';
import dayjs from 'dayjs';
import type { CacheService } from '@/common/cache/cache.service';
import { checkRedisResult } from '@/constants/constants';
import type {
  WechatCheckSignatureRequest,
  WechatCode2sessionResponse,
  WechatGetAccessTokenResponse,
  WechatMessageOriginalRequest,
  WechatMessageRequest,
} from '@/type/wechat';
import { sha1 } from '@powerfulyang/node-utils';
import crypto from 'crypto';
import { parseStringPromise } from 'xml2js';

export class WechatService {
  private Key: string;

  private appId: string;

  private appSecret: string;

  private TOKEN: string;

  private encodingAESKey: string;

  constructor(
    protected readonly logger: LoggerService,
    protected readonly cacheService: CacheService,
  ) {
    if (!this.logger || !this.cacheService) {
      throw new InternalServerErrorException('logger or cacheService is undefined');
    }
  }

  init(REDIS_KEY: string, appId: string, appSecret: string, token: string, encodingAESKey: string) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.Key = REDIS_KEY;
    this.TOKEN = token;
    this.encodingAESKey = encodingAESKey;
  }

  async getAccessToken(): Promise<string> {
    const accessToken = await this.cacheService.get(this.Key);
    if (accessToken) {
      return accessToken;
    }
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`;
    const response = await fetch(url);
    const json = (await response.json()) as WechatGetAccessTokenResponse;
    if (json.errcode) {
      this.logger.error(`getAccessToken error: ${json.errmsg}`);
      throw new InternalServerErrorException(json.errmsg);
    }
    this.logger.info(
      `access_token will be expired at ${dayjs()
        .add(json.expires_in, 'second')
        .format('YYYY-MM-DD HH:mm:ss')}`,
    );
    const token = json.access_token;
    const res = await this.cacheService.set(this.Key, token, 'EX', json.expires_in);
    checkRedisResult(res);
    return token;
  }

  checkSignature(query: WechatCheckSignatureRequest) {
    const { signature, timestamp, nonce, echostr } = query;
    const token = this.TOKEN;
    const arr = [token, timestamp, nonce].sort();
    const sha1Str = sha1(arr.join(''));
    if (sha1Str === signature) {
      return echostr;
    }
    throw new InternalServerErrorException('checkSignature error');
  }

  decryptData(encryptedData: string) {
    const key = this.encodingAESKey;
    if (!key) {
      throw new InternalServerErrorException('WECHAT_MINI_APP_AES_KEY is not defined');
    }
    const aesKey = Buffer.from(key, 'base64');
    const iv = aesKey.slice(0, 16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
    decipher.setAutoPadding(false);
    return decipher.update(encryptedData, 'base64', 'utf8');
  }

  async handleMessage(request: WechatMessageOriginalRequest): Promise<WechatMessageRequest> {
    const decryptData = this.decryptData(request.Encrypt);
    let json;
    // drop random string
    let str = decryptData.slice(16);
    const lastChar = decryptData[decryptData.length - 1];
    // drop control characters
    str = str.replaceAll(lastChar, '');
    // extract corpId
    const corpId = str.slice(-this.appId.length);
    // drop head four characters
    str = str.slice(4, -this.appId.length);
    if (str.startsWith('<xml>')) {
      json = await parseStringPromise(str, { explicitArray: false, explicitRoot: false });
    } else {
      json = JSON.parse(str);
    }
    this.logger.debug(`corpId: ${corpId}\nsubscribeMessage:\n${JSON.stringify(json, null, 2)}`);
    return json;
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
    return json;
  }
}
