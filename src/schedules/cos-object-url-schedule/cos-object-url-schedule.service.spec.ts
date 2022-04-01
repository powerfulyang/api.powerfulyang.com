import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { CosObjectUrlScheduleService } from './cos-object-url-schedule.service';
import { SchedulesModule } from '@/schedules/schedules.module';

describe('CosObjectUrlScheduleService', () => {
  let service: CosObjectUrlScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SchedulesModule],
    }).compile();

    service = module.get<CosObjectUrlScheduleService>(CosObjectUrlScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
