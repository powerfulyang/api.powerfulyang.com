import { Module } from '@nestjs/common';
import { PixivBotService } from './pixiv-bot.service.mjs';

@Module({
  providers: [PixivBotService],
  exports: [PixivBotService],
})
export class PixivBotModule {}
