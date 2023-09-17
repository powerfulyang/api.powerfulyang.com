import { LoggerModule } from '@/common/logger/logger.module';
import { FeedModule } from '@/feed/feed.module';
import { MqModule } from '@/service/mq/mq.module';
import { Module } from '@nestjs/common';
import { ProxyFetchModule } from '@/libs/proxy-fetch';
import { TelegramBotService } from './telegram-bot.service';

@Module({
  imports: [ProxyFetchModule.forRoot(), LoggerModule, MqModule, FeedModule],
  providers: [TelegramBotService],
  exports: [TelegramBotService],
})
export class TelegramBotModule {}
