import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppLogger } from '@/common/logger/app.logger';
import { CoreService } from '@/core/core.service';
import { SUCCESS } from '@/constants/constants';
import { AssetService } from '@/modules/asset/asset.service';
import { ScheduleType } from '@/enum/ScheduleType';

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
    const bool = await this.coreService.isProdScheduleNode();
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
