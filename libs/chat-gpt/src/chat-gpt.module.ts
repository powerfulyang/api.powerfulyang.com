import { Module } from '@nestjs/common';
import { ProxyFetchModule } from 'api/proxy-fetch';
import { ChatGptService } from './chat-gpt.service';

@Module({
  imports: [ProxyFetchModule],
  providers: [ChatGptService],
  exports: [ChatGptService],
})
export class ChatGptModule {}
