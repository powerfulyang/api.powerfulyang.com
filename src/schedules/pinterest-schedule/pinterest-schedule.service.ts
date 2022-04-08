import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerService } from '@/common/logger/logger.service';
import { CoreService } from '@/core/core.service';
import { AssetService } from '@/modules/asset/asset.service';
import { ScheduleType } from '@/enum/ScheduleType';

@Injectable()
export class PinterestScheduleService {
  constructor(
    private readonly logger: LoggerService,
    private readonly coreService: CoreService,
    private readonly assetService: AssetService,
  ) {
    this.logger.setContext(PinterestScheduleService.name);
  }

  /**
   * 整点45分时触发
   */
  @Cron('0 45 * * * *')
  async bot() {
    try {
      const bool = await this.coreService.isProdScheduleNode();
      if (bool) {
        this.assetService.assetBotSchedule(ScheduleType.pinterest).catch((e) => {
          this.logger.error(e);
        });
      }
    } catch (e) {
      this.logger.error(e);
    }
  }
}
