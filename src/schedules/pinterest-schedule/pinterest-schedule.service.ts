import { Injectable } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger';
import { CoreService } from '@/core/core.service';
import { AssetOrigin } from '@/enum/AssetOrigin';
import { SUCCESS } from '@/constants/constants';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PinterestScheduleService {
    constructor(
        private logger: AppLogger,
        private coreService: CoreService,
    ) {
        this.logger.setContext(PinterestScheduleService.name);
    }

    @Cron('* 45 * * * *')
    async bot() {
        try {
            await this.coreService.botBaseService(
                AssetOrigin.pinterest,
            );
        } catch (e) {
            this.logger.error(this.bot.name, e);
        }
        return SUCCESS;
    }
}
