import { Module } from '@nestjs/common';
import { ProxyFetchModule } from '@/libs/proxy-fetch';
import { PinterestBotService } from './pinterest-bot.service';

@Module({
  imports: [ProxyFetchModule.forRoot()],
  providers: [PinterestBotService],
  exports: [PinterestBotService],
})
export class PinterestBotModule {}
