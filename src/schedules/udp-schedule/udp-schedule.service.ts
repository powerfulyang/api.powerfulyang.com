import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { UdpServerService } from 'api/udp-server';

@Injectable()
export class UdpScheduleService {
    constructor(private udpServerService: UdpServerService) {}

    @Interval(12 * 60 * 60 * 1000)
    healthCheck() {
        this.udpServerService.send('health check!');
    }
}
