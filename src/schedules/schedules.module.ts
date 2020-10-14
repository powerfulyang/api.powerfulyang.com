import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PixivScheduleService } from './pixiv-schedule/pixiv-schedule.service';
import { InstagramScheduleService } from './instagram-schedule/instagram-schedule.service';
import { PinterestScheduleService } from './pinterest-schedule/pinterest-schedule.service';

@Module({
    imports: [ScheduleModule.forRoot()],
    providers: [
        PixivScheduleService,
        InstagramScheduleService,
        PinterestScheduleService,
    ],
})
export class SchedulesModule {}
