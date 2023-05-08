import { LoggerModule } from '@/common/logger/logger.module';
import { Module } from '@nestjs/common';
import { ProxyFetchModule } from 'api/proxy-fetch';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';

@Module({
  imports: [ProxyFetchModule.forRoot(), LoggerModule],
  controllers: [ToolsController],
  providers: [ToolsService],
})
export class ToolsModule {}
