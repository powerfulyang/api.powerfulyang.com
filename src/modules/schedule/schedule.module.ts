import { Module } from '@nestjs/common';
import { SchedulesModule } from '@/schedules/schedules.module';
import { ScheduleController } from './schedule.controller';
import { LoggerModule } from '@/common/logger/logger.module';

@Module({
  imports: [SchedulesModule, LoggerModule],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
