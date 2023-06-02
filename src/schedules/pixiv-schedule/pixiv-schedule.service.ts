import { LoggerService } from '@/common/logger/logger.service';
import { CoreService } from '@/core/core.service';
import { ScheduleType } from '@/enum/ScheduleType';
import { AssetService } from '@/asset/asset.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

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
      this.logger.info('===========每个整点30分执行一次 pixiv bot===========');
      this.main();
    }
  }

  main() {
    this.assetService.assetBotSchedule(ScheduleType.pixiv).catch((e) => {
      this.logger.error(e);
    });
  }
}
