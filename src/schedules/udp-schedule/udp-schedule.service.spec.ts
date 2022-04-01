import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { UdpScheduleService } from './udp-schedule.service';
import { SchedulesModule } from '@/schedules/schedules.module';

describe('UdpScheduleService', () => {
  let service: UdpScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchedulesModule],
    }).compile();

    service = module.get<UdpScheduleService>(UdpScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
