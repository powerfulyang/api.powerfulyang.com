import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PixivBotService } from 'api/pixiv-bot';

@Injectable()
export class PixivScheduleService {
    private readonly logger = new Logger(PixivScheduleService.name);

    constructor(private readonly pixivBotService: PixivBotService) {}

    @Interval(10000)
    async bot() {
        this.logger.debug('call once after 10 seconds');
        const undoes = await this.pixivBotService.fetchUndo();
        return undoes;
    }
}
