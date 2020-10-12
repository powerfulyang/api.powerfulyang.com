import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PixivBotModule } from 'api/pixiv-bot';
import { Asset } from '@/entity/asset.entity';
import { PixivScheduleService } from './pixiv-schedule/pixiv-schedule.service';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        PixivBotModule,
        TypeOrmModule.forFeature([Asset]),
    ],
    providers: [PixivScheduleService],
})
export class SchedulesModule {}
