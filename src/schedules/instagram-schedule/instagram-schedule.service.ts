import { Injectable } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger';
import { CoreService } from '@/core/core.service';
import { AssetBucket } from '@/enum/AssetBucket';
import { SUCCESS } from '@/constants/constants';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class InstagramScheduleService {
  constructor(private logger: AppLogger, private coreService: CoreService) {
    this.logger.setContext(InstagramScheduleService.name);
  }

  @Cron('0 15 * * * *')
  async bot() {
    const bool = await this.coreService.isProdCommonNode();
    if (!bool) {
      return SUCCESS;
    }
    try {
      await this.coreService.botBaseService(AssetBucket.instagram);
    } catch (e) {
      this.logger.error(this.bot.name, e);
    }
    return SUCCESS;
  }
}
