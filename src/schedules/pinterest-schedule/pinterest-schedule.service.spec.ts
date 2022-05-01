import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { SchedulesModule } from '@/schedules/schedules.module';
import { PinterestScheduleService } from './pinterest-schedule.service';

describe('PinterestScheduleService', () => {
  let service: PinterestScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SchedulesModule],
    }).compile();

    service = module.get<PinterestScheduleService>(PinterestScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
