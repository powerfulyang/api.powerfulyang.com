import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PixivBotModule } from 'api/pixiv-bot';
import { PinterestRssModule } from 'api/pinterest-rss';
import { InstagramBotModule } from 'api/instagram-bot';
import { PixivScheduleService } from './pixiv-schedule/pixiv-schedule.service';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        PixivBotModule,
        PinterestRssModule,
        InstagramBotModule,
    ],
    providers: [PixivScheduleService],
})
export class SchedulesModule {}
