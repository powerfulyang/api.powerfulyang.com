import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppLogger } from '@/common/logger/app.logger.mjs';
import { CoreService } from '@/core/core.service.mjs';
import { SUCCESS } from '@/constants/constants.mjs';
import { AssetService } from '@/modules/asset/asset.service.mjs';
import { ScheduleType } from '@/enum/ScheduleType.mjs';

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
      await this.assetService.assetBotSchedule(ScheduleType.instagram);
    } catch (e) {
      this.logger.error(e);
    }
    return SUCCESS;
  }
}
