import { Module } from '@nestjs/common';
import { ProxyFetchModule } from 'api/proxy-fetch';
import { TelegramBotService } from './telegram-bot.service';

@Module({
  imports: [ProxyFetchModule.forRoot()],
  providers: [TelegramBotService],
  exports: [TelegramBotService],
})
export class TelegramBotModule {}
