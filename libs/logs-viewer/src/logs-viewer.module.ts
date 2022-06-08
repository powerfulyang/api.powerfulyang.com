import { Module } from '@nestjs/common';
import { EsModule } from '@/common/ES/es.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { LogsViewerService } from './logs-viewer.service';

@Module({
  imports: [EsModule, LoggerModule],
  providers: [LogsViewerService],
  exports: [LogsViewerService],
})
export class LogsViewerModule {}
