import { Injectable } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger';
import { CoreService } from '@/core/core.service';
import { AssetBucket } from '@/enum/AssetBucket';
import { SUCCESS } from '@/constants/constants';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PinterestScheduleService {
  constructor(private logger: AppLogger, private coreService: CoreService) {
    this.logger.setContext(PinterestScheduleService.name);
  }

  @Cron('0 45 * * * *')
  async bot() {
    const bool = await this.coreService.isProdCommonNode();
    if (!bool) {
      return SUCCESS;
    }
    try {
      await this.coreService.botBaseService(AssetBucket.pinterest);
    } catch (e) {
      this.logger.error(this.bot.name, e);
    }
    return SUCCESS;
  }
}
