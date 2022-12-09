import { Injectable } from '@nestjs/common';
import { WechatService } from '@app/wechat/wechat.service';
import { generateUuid } from '@/utils/uuid';
import fetch from 'node-fetch';
import { LoggerService } from '@/common/logger/logger.service';
import { CacheService } from '@/common/cache/cache.service';

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
      this.init('wechat:official-account:access-token', appId, appSecret, token, encodingAESKey);
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
}
