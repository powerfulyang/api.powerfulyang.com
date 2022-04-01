import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PixivScheduleService } from './pixiv-schedule.service';
import { SchedulesModule } from '@/schedules/schedules.module';

describe('PixivScheduleService', () => {
  let service: PixivScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SchedulesModule],
    }).compile();

    service = module.get<PixivScheduleService>(PixivScheduleService);
  });

  it('should be defined', async () => {
    await expect(service).toBeDefined();
  });
});
