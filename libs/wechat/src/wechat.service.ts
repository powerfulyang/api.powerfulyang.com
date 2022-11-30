import { LoggerService } from '@/common/logger/logger.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch';
import dayjs from 'dayjs';
import { generateUuid } from '@/utils/uuid';
import { CacheService } from '@/common/cache/cache.service';
import { checkRedisResult } from '@/constants/constants';
import type { WechatGetAccessTokenResponse } from '@/typings/wechat';

@Injectable()
export class WechatService {
  static Key = 'wechat_access_token';

  private readonly appId = process.env.WECHAT_APP_ID;

  private readonly appSecret = process.env.WECHAT_APP_SECRET;

  constructor(private readonly logger: LoggerService, private readonly cacheService: CacheService) {
    this.logger.setContext(WechatService.name);
    if (this.appId && this.appSecret) {
      this.getAccessToken().catch((e) => {
        this.logger.error(e);
      });
    }
  }

  async getAccessToken(): Promise<string> {
    const accessToken = await this.cacheService.get(WechatService.Key);
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
    const res = await this.cacheService.set(WechatService.Key, token, 'EX', json.expires_in);
    checkRedisResult(res);
    return token;
  }

  async createTmpQrcode(QR_STR_SCENE: string = generateUuid()) {
    const accessToken = await this.getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${accessToken}`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        action_name: 'QR_STR_SCENE',
        action_info: {
          scene: {
            scene_str: QR_STR_SCENE,
          },
        },
      }),
    });
    const json = await response.json();
    return json.url;
  }
}
