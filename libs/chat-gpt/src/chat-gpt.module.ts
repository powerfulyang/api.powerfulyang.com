import { Module } from '@nestjs/common';
import { ProxyFetchModule } from 'api/proxy-fetch';
import { CacheModule } from '@/common/cache/cache.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { ChatGptService } from './chat-gpt.service';

@Module({
  imports: [ProxyFetchModule.forRoot(), CacheModule, LoggerModule],
  providers: [ChatGptService],
  exports: [ChatGptService],
})
export class ChatGptModule {}
