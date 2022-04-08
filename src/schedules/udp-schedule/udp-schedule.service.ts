import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { UdpServerService } from 'api/udp-server';
import { LoggerService } from '@/common/logger/logger.service';

@Injectable()
export class UdpScheduleService {
  constructor(
    private readonly udpServerService: UdpServerService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(UdpScheduleService.name);
  }

  /**
   * 每12小时执行一次
   */
  @Interval(12 * 60 * 60 * 1000)
  healthCheck() {
    try {
      this.udpServerService.send('health check!');
    } catch (e) {
      this.logger.error(e);
    }
  }
}
