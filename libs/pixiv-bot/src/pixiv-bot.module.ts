import { Module } from '@nestjs/common';
import { ProxyFetchModule } from 'api/proxy-fetch';
import { PixivBotService } from './pixiv-bot.service';

@Module({
    imports: [ProxyFetchModule],
    providers: [PixivBotService],
    exports: [PixivBotService],
})
export class PixivBotModule {}
