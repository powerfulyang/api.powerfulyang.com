import { Module } from '@nestjs/common';
import { LoggerModule } from '@/common/logger/logger.module';
import { UdpServerService } from './udp-server.service';

@Module({
  imports: [LoggerModule],
  providers: [UdpServerService],
  exports: [UdpServerService],
})
export class UdpServerModule {}
