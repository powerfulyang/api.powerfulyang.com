import { LoggerModule } from '@/common/logger/logger.module';
import { EsModule } from '@/common/service/es/es.module';
import { Module } from '@nestjs/common';
import { LogsViewerController } from 'api/logs-viewer/logs-viewer.controller';
import { LogsViewerService } from './logs-viewer.service';

@Module({
  imports: [EsModule, LoggerModule],
  providers: [LogsViewerService],
  exports: [LogsViewerService],
  controllers: [LogsViewerController],
})
export class LogsViewerModule {}
