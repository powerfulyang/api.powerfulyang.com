import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { UdpServerModule, UdpServerService } from 'api/udp-server';
import { LoggerModule } from '@/common/logger/logger.module';
import { UdpScheduleService } from './udp-schedule.service';

describe('UdpScheduleService', () => {
  let service: UdpScheduleService;
  let udpServerService: UdpServerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, UdpServerModule],
      providers: [UdpScheduleService],
    }).compile();

    service = module.get<UdpScheduleService>(UdpScheduleService);
    udpServerService = module.get<UdpServerService>(UdpServerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(() => {
    udpServerService.close();
  });
});
