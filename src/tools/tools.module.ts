import { LoggerModule } from '@/common/logger/logger.module';
import { ProxyFetchModule } from '@/libs/proxy-fetch';
import { Module } from '@nestjs/common';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';

@Module({
  imports: [ProxyFetchModule.forRoot(), LoggerModule],
  controllers: [ToolsController],
  providers: [ToolsService],
})
export class ToolsModule {}
