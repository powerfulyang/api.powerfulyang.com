import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppLogger } from '@/common/logger/app.logger.mjs';
import { CoreService } from '@/core/core.service.mjs';
import { SUCCESS } from '@/constants/constants.mjs';
import { AssetService } from '@/modules/asset/asset.service.mjs';
import { ScheduleType } from '@/enum/ScheduleType.mjs';

@Injectable()
export class PinterestScheduleService {
  constructor(
    private readonly logger: AppLogger,
    private readonly coreService: CoreService,
    private readonly assetService: AssetService,
  ) {
    this.logger.setContext(PinterestScheduleService.name);
  }

  @Cron('0 45 * * * *')
  async bot() {
    const bool = await this.coreService.isProdCommonNode();
    if (!bool) {
      return SUCCESS;
    }
    try {
      await this.assetService.assetBotSchedule(ScheduleType.pinterest);
    } catch (e) {
      this.logger.error(e);
    }
    return SUCCESS;
  }
}
