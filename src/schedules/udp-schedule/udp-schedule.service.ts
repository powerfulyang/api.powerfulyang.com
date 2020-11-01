import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { UdpServerService } from 'api/udp-server';
import { __dev__ } from '@powerfulyang/utils';
import { AppLogger } from '@/common/logger/app.logger';

@Injectable()
export class UdpScheduleService {
    constructor(
        private udpServerService: UdpServerService,
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(UdpScheduleService.name);
    }

    @Interval(12 * 60 * 60 * 1000)
    healthCheck() {
        if (__dev__) {
            this.logger.debug('not run in dev mode!');
            return;
        }
        this.udpServerService.send('health check!');
    }
}
