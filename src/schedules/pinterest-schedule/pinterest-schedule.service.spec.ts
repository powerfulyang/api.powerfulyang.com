import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PinterestScheduleService } from './pinterest-schedule.service';
import { SchedulesModule } from '@/schedules/schedules.module';

describe('PinterestScheduleService', () => {
  let service: PinterestScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SchedulesModule],
    }).compile();

    service = module.get<PinterestScheduleService>(PinterestScheduleService);
  });

  it('should be defined', async () => {
    await expect(service).toBeDefined();
  });
});
