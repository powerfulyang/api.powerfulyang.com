import { OcrService } from '@/tools/ocr/ocrService';
import { Module } from '@nestjs/common';
import { LoggerModule } from '@/common/logger/logger.module';
import { ProxyFetchModule } from '@/libs/proxy-fetch/proxy-fetch.module';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';

@Module({
  imports: [ProxyFetchModule.forRoot(), LoggerModule],
  controllers: [ToolsController],
  providers: [ToolsService, OcrService],
  exports: [ToolsService, OcrService],
})
export class ToolsModule {}
