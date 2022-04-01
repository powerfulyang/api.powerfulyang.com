import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { InstagramScheduleService } from './instagram-schedule.service';
import { SchedulesModule } from '@/schedules/schedules.module';

describe('InstagramScheduleService', () => {
  let service: InstagramScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SchedulesModule],
    }).compile();

    service = module.get<InstagramScheduleService>(InstagramScheduleService);
  });

  it('should be defined', async () => {
    await expect(service).toBeDefined();
  });
});
