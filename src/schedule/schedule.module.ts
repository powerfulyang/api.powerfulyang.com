import { Module } from '@nestjs/common';
import { LoggerModule } from '@/common/logger/logger.module';
import { SchedulesModule } from '@/schedules/schedules.module';
import { ScheduleController } from './schedule.controller';

@Module({
  imports: [SchedulesModule, LoggerModule],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
