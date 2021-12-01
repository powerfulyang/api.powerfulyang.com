import { Module } from '@nestjs/common';
import { InstagramBotService } from './instagram-bot.service.mjs';

@Module({
  providers: [InstagramBotService],
  exports: [InstagramBotService],
})
export class InstagramBotModule {}
