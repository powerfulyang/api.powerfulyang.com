import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LoggerService } from '@/common/logger/logger.service';
import { CoreService } from '@/core/core.service';
import { AssetService } from '@/modules/asset/asset.service';
import { ScheduleType } from '@/enum/ScheduleType';

@Injectable()
export class PixivScheduleService {
  constructor(
    private readonly logger: LoggerService,
    private readonly coreService: CoreService,
    private readonly assetService: AssetService,
  ) {
    this.logger.setContext(PixivScheduleService.name);
  }

  /**
   * 整点30分时触发
   */
  @Cron('0 30 * * * *')
  async bot() {
    const bool = await this.coreService.isProdScheduleNode();
    if (bool) {
      this.assetService.assetBotSchedule(ScheduleType.pixiv).catch((e) => {
        this.logger.error(e);
      });
    }
  }
}
