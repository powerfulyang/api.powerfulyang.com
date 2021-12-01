import { Module } from '@nestjs/common';
import { UdpServerService } from './udp-server.service.mjs';

@Module({
  providers: [UdpServerService],
  exports: [UdpServerService],
})
export class UdpServerModule {}
