import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppLogger } from '@/common/logger/app.logger';
import { CoreService } from '@/core/core.service';
import { AssetBucket } from '@/enum/AssetBucket';
import { SUCCESS } from '@/constants/constants';
import { AssetService } from '@/modules/asset/asset.service';

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
      await this.assetService.assetBotSchedule(AssetBucket.pinterest);
    } catch (e) {
      this.logger.error(this.bot.name, e);
    }
    return SUCCESS;
  }
}
