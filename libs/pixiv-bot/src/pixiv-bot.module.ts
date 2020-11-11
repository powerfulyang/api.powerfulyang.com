import { Module } from '@nestjs/common';
import { PixivBotService } from './pixiv-bot.service';

@Module({
  providers: [PixivBotService],
  exports: [PixivBotService],
})
export class PixivBotModule {}
