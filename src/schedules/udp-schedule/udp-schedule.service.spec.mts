import { Test, TestingModule } from '@nestjs/testing';
import { UdpScheduleService } from './udp-schedule.service.mjs';

describe('UdpScheduleService', () => {
  let service: UdpScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UdpScheduleService],
    }).compile();

    service = module.get<UdpScheduleService>(UdpScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
