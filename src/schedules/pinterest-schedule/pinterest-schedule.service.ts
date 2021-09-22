import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppLogger } from '@/common/logger/app.logger';
import { CoreService } from '@/core/core.service';
import { AssetBucket } from '@/enum/AssetBucket';
import { SUCCESS } from '@/constants/constants';

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
