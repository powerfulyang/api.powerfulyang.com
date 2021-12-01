import { Module } from '@nestjs/common';
import { SchedulesModule } from '@/schedules/schedules.module.mjs';
import { ScheduleController } from './schedule.controller.mjs';
import { ScheduleService } from './schedule.service.mjs';

@Module({
  imports: [SchedulesModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
