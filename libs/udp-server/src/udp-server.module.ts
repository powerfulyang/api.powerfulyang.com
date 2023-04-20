import { LoggerModule } from '@/common/logger/logger.module';
import { Module } from '@nestjs/common';
import { UdpServerService } from './udp-server.service';

@Module({
  imports: [LoggerModule],
  providers: [UdpServerService],
  exports: [UdpServerService],
})
export class UdpServerModule {}
