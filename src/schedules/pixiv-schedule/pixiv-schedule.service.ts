import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class PixivScheduleService {
    private readonly logger = new Logger(PixivScheduleService.name);

    @Interval(10000)
    async bot() {
        this.logger.debug('call once after 10 seconds');
    }
}
