import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { SchedulesModule } from '@/schedules/schedules.module';
import { InstagramScheduleService } from './instagram-schedule.service';

describe('InstagramScheduleService', () => {
  let service: InstagramScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SchedulesModule],
    }).compile();

    service = module.get<InstagramScheduleService>(InstagramScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
