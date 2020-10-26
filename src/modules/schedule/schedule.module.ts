import { Module } from '@nestjs/common';
import { SchedulesModule } from '@/schedules/schedules.module';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

@Module({
    imports: [SchedulesModule],
    controllers: [ScheduleController],
    providers: [ScheduleService],
})
export class ScheduleModule {}
