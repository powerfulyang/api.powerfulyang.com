import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SUCCESS } from '@/constants/constants';
import { AppLogger } from '@/common/logger/app.logger';
import { CoreService } from '@/core/core.service';
import { AssetService } from '@/modules/asset/asset.service';
import { ScheduleType } from '@/enum/ScheduleType';

@Injectable()
export class PixivScheduleService {
  constructor(
    private readonly logger: AppLogger,
    private readonly coreService: CoreService,
    private readonly assetService: AssetService,
  ) {
    this.logger.setContext(PixivScheduleService.name);
  }

  @Cron('0 30 * * * *')
  async bot() {
    const bool = await this.coreService.isProdCommonNode();
    if (!bool) {
      return SUCCESS;
    }
    try {
      await this.assetService.assetBotSchedule(ScheduleType.pixiv);
    } catch (e) {
      this.logger.error(e);
    }
    return SUCCESS;
  }
}
