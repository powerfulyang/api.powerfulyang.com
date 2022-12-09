import { LoggerService } from '@/common/logger/logger.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch';
import type {
  ReplySubscribeMessageRequest,
  WechatBaseResponse,
  WechatGetUnlimitedQRCodeRequest,
} from '@/typings/wechat';
import { CacheService } from '@/common/cache/cache.service';
import dayjs from 'dayjs';
import { WeatherService } from '@app/weather';
import { WechatService } from '@app/wechat/wechat.service';

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
      this.init('wechat:mini-program:access-token', appId, appSecret, token, encodingAESKey);
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
}
