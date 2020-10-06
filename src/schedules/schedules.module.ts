import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PixivScheduleService } from './pixiv-schedule/pixiv-schedule.service';

@Module({
    imports: [ScheduleModule.forRoot()],
    providers: [PixivScheduleService],
})
export class SchedulesModule {}
