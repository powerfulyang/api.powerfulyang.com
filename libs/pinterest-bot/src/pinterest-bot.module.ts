import { Module } from '@nestjs/common';
import { PinterestBotService } from './pinterest-bot.service';

@Module({
  providers: [PinterestBotService],
  exports: [PinterestBotService],
})
export class PinterestBotModule {}
