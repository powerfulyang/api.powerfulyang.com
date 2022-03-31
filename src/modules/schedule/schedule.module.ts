import { Module } from '@nestjs/common';
import { SchedulesModule } from '@/schedules/schedules.module';
import { ScheduleController } from './schedule.controller';

@Module({
  imports: [SchedulesModule],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
