import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { SchedulesModule } from '@/schedules/schedules.module';
import { PixivScheduleService } from './pixiv-schedule.service';

describe('PixivScheduleService', () => {
  let service: PixivScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SchedulesModule],
    }).compile();

    service = module.get<PixivScheduleService>(PixivScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
