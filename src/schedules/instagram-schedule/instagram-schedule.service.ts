import { LoggerService } from '@/common/logger/logger.service';
import { CoreService } from '@/core/core.service';
import { ScheduleType } from '@/enum/ScheduleType';
import { AssetService } from '@/modules/asset/asset.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class InstagramScheduleService {
  constructor(
    private readonly logger: LoggerService,
    private readonly coreService: CoreService,
    private readonly assetService: AssetService,
  ) {
    this.logger.setContext(InstagramScheduleService.name);
  }

  /**
   * 整点15分时触发
   */
  @Cron('0 15 * * * *')
  async bot() {
    const bool = await this.coreService.isProdScheduleNode();
    if (bool) {
      this.logger.info('===========每个整点15分执行一次 instagram bot===========');
      this.main();
    }
  }

  main() {
    // due to `Avoid poor quality proxies. Instagram is now very sensitive with datacenter IP Addresses.`
    return;
    this.assetService.assetBotSchedule(ScheduleType.instagram).catch((e) => {
      this.logger.error(e);
    });
  }
}
