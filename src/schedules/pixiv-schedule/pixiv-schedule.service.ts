import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SUCCESS } from '@/constants/constants';
import { AppLogger } from '@/common/logger/app.logger';
import { CoreService } from '@/core/core.service';
import { AssetBucket } from '@/enum/AssetBucket';
import { COMMON_CODE_UUID } from '@/utils/uuid';

@Injectable()
export class PixivScheduleService {
  constructor(private logger: AppLogger, private coreService: CoreService) {
    this.logger.setContext(PixivScheduleService.name);
  }

  @Cron('0 30 * * * *')
  async bot() {
    const uuid = await this.coreService.getCommonNodeUuid();
    if (uuid !== COMMON_CODE_UUID) {
      return SUCCESS;
    }
    try {
      await this.coreService.botBaseService(AssetBucket.pixiv);
    } catch (e) {
      this.logger.error(this.bot.name, e);
    }
    return SUCCESS;
  }
}
