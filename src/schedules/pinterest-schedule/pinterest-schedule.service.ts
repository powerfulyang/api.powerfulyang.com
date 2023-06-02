import { LoggerService } from '@/common/logger/logger.service';
import { CoreService } from '@/core/core.service';
import { ScheduleType } from '@/enum/ScheduleType';
import { AssetService } from '@/asset/asset.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

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
    const bool = await this.coreService.isProdScheduleNode();
    if (bool) {
      this.logger.info('===========每个整点45分执行一次 pinterest bot===========');
      this.main();
    }
  }

  main() {
    this.assetService.assetBotSchedule(ScheduleType.pinterest).catch((e) => {
      this.logger.error(e);
    });
  }
}
