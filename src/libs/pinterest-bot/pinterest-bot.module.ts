import { LoggerModule } from '@/common/logger/logger.module';
import { Module } from '@nestjs/common';
import { ProxyFetchModule } from '@/libs/proxy-fetch';
import { PinterestBotService } from './pinterest-bot.service';

@Module({
  imports: [ProxyFetchModule.forRoot(), LoggerModule],
  providers: [PinterestBotService],
  exports: [PinterestBotService],
})
export class PinterestBotModule {}
