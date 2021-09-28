import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppLogger } from '@/common/logger/app.logger';
import { CoreService } from '@/core/core.service';
import { AssetBucket } from '@/enum/AssetBucket';
import { SUCCESS } from '@/constants/constants';
import { AssetService } from '@/modules/asset/asset.service';

@Injectable()
export class InstagramScheduleService {
  constructor(
    private readonly logger: AppLogger,
    private readonly coreService: CoreService,
    private readonly assetService: AssetService,
  ) {
    this.logger.setContext(InstagramScheduleService.name);
  }

  @Cron('0 15 * * * *')
  async bot() {
    const bool = await this.coreService.isProdCommonNode();
    if (!bool) {
      return SUCCESS;
    }
    try {
      await this.assetService.assetBotSchedule(AssetBucket.instagram);
    } catch (e) {
      this.logger.error(e);
    }
    return SUCCESS;
  }
}
