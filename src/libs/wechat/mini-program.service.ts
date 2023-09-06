import process from 'node:process';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import dayjs from 'dayjs';
import fetch from 'node-fetch';
import { CacheService } from '@/common/cache/cache.service';
import { LoggerService } from '@/common/logger/logger.service';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';
import { WeatherService } from '@/libs/weather';
import type {
  ReplySubscribeMessageRequest,
  WechatBaseResponse,
  WechatGetUnlimitedQRCodeRequest,
  WechatMessageOriginalRequest,
  WechatMiniProgramSendCustomMessageRequest,
} from '@/type/wechat';
import { WechatService } from './wechat.service';

@Injectable()
export class MiniProgramService extends WechatService {
  constructor(
    protected readonly logger: LoggerService,
    protected readonly cacheService: CacheService,
    private readonly weatherService: WeatherService,
  ) {
    super(logger, cacheService);
    this.logger.setContext(MiniProgramService.name);
    const appId = process.env.WECHAT_MINI_PROGRAM_APP_ID;
    const appSecret = process.env.WECHAT_MINI_PROGRAM_APP_SECRET;
    const token = process.env.WECHAT_MINI_PROGRAM_TOKEN;
    const encodingAESKey = process.env.WECHAT_MINI_PROGRAM_ENCODING_AES_KEY;
    if (appId && appSecret && token && encodingAESKey) {
      this.init(
        REDIS_KEYS.WECHAT_MINI_PROGRAM_ACCESS_TOKEN,
        appId,
        appSecret,
        token,
        encodingAESKey,
      );
    }
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

  async sendCustomMessage(request: WechatMiniProgramSendCustomMessageRequest) {
    const accessToken = await this.getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${accessToken}`;
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    const json = (await res.json()) as WechatBaseResponse;
    if (json.errcode) {
      this.logger.error(`sendCustomMessage error: ${json.errmsg}`);
      throw new Error(json.errmsg);
    }
    return json;
  }

  async handleMiniProgramMessage(request: WechatMessageOriginalRequest) {
    const json = await this.handleMessage(request);
    if ('MsgType' in json) {
      if (json.MsgType === 'event' && json.Event === 'user_enter_tempsession') {
        // enter temp session
      }
    }
    return Promise.resolve();
  }
}
