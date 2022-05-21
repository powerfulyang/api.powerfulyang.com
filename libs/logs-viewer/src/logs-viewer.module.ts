import { Module } from '@nestjs/common';
import { EsModule } from '@/common/ES/es.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { LogsViewerController } from 'api/logs-viewer/logs-viewer.controller';
import { LogsViewerService } from './logs-viewer.service';

@Module({
  imports: [EsModule, LoggerModule],
  providers: [LogsViewerService],
  exports: [LogsViewerService],
  controllers: [LogsViewerController],
})
export class LogsViewerModule {}
