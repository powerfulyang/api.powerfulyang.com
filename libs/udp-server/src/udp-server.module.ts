import { Module } from '@nestjs/common';
import { UdpServerService } from './udp-server.service';
import { LoggerModule } from '@/common/logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [UdpServerService],
  exports: [UdpServerService],
})
export class UdpServerModule {}
