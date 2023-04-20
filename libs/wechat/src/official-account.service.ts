import { CacheService } from '@/common/cache/cache.service';
import { LoggerService } from '@/common/logger/logger.service';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';
import type { WechatMessageOriginalRequest } from '@/type/wechat';
import { generateUuid } from '@/utils/uuid';
import { WechatService } from '@app/wechat/wechat.service';
import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import process from 'node:process';

@Injectable()
export class OfficialAccountService extends WechatService {
  constructor(
    protected readonly logger: LoggerService,
    protected readonly cacheService: CacheService,
  ) {
    super(logger, cacheService);
    this.logger.setContext(OfficialAccountService.name);
    const appId = process.env.WECHAT_OFFICIAL_ACCOUNT_APP_ID;
    const appSecret = process.env.WECHAT_OFFICIAL_ACCOUNT_APP_SECRET;
    const token = process.env.WECHAT_OFFICIAL_ACCOUNT_TOKEN;
    const encodingAESKey = process.env.WECHAT_OFFICIAL_ACCOUNT_ENCODING_AES_KEY;
    if (appId && appSecret && token && encodingAESKey) {
      this.init(
        REDIS_KEYS.WECHAT_OFFICIAL_ACCOUNT_ACCESS_TOKEN,
        appId,
        appSecret,
        token,
        encodingAESKey,
      );
    }
  }

  /**
   * @description 生成带参数的二维码
   * @param QR_STR_SCENE 临时二维码
   */
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

  handleOfficialAccountMessage(request: WechatMessageOriginalRequest) {
    return this.handleMessage(request);
  }
}
