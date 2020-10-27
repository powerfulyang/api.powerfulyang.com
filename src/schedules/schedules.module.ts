import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UdpServerModule } from 'api/udp-server';
import { PixivScheduleService } from './pixiv-schedule/pixiv-schedule.service';
import { InstagramScheduleService } from './instagram-schedule/instagram-schedule.service';
import { PinterestScheduleService } from './pinterest-schedule/pinterest-schedule.service';
import { UdpScheduleService } from './udp-schedule/udp-schedule.service';

@Module({
    imports: [ScheduleModule.forRoot(), UdpServerModule],
    providers: [
        PixivScheduleService,
        InstagramScheduleService,
        PinterestScheduleService,
        UdpScheduleService,
    ],
    exports: [
        PixivScheduleService,
        InstagramScheduleService,
        PinterestScheduleService,
    ],
})
export class SchedulesModule {}
