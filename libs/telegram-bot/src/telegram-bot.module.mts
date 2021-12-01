import { Global, Module } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service.mjs';

@Global()
@Module({
  providers: [TelegramBotService],
  exports: [TelegramBotService],
})
export class TelegramBotModule {}
