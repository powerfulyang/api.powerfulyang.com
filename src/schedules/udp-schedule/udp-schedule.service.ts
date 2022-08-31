import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { UdpServerService } from 'api/udp-server';
import { LoggerService } from '@/common/logger/logger.service';

@Injectable()
export class UdpScheduleService {
  constructor(
    private readonly logger: LoggerService,
    private readonly udpServerService: UdpServerService,
  ) {
    this.logger.setContext(UdpScheduleService.name);
  }

  /**
   * 每12小时执行一次
   */
  @Interval(12 * 60 * 60 * 1000)
  healthCheck() {
    this.udpServerService.send('health check!');
  }
}
