import { LoggerModule } from '@/common/logger/logger.module';
import { Module } from '@nestjs/common';
import { ProxyFetchModule } from '@/libs/proxy-fetch';
import { PixivBotService } from './pixiv-bot.service';

@Module({
  imports: [ProxyFetchModule.forRoot(), LoggerModule],
  providers: [PixivBotService],
  exports: [PixivBotService],
})
export class PixivBotModule {}
