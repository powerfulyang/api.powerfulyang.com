import { Module } from '@nestjs/common';
import { ProxyFetchModule } from '@/libs/proxy-fetch';
import { InstagramBotService } from './instagram-bot.service';

@Module({
  imports: [ProxyFetchModule.forRoot()],
  providers: [InstagramBotService],
  exports: [InstagramBotService],
})
export class InstagramBotModule {}
