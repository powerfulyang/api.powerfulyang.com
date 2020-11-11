import { Module } from '@nestjs/common';
import { InstagramBotService } from './instagram-bot.service';

@Module({
  providers: [InstagramBotService],
  exports: [InstagramBotService],
})
export class InstagramBotModule {}
