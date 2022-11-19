import { Module } from '@nestjs/common';
import { LoggerModule } from '@/common/logger/logger.module';
import { CacheModule } from '@/common/cache/cache.module';
import { WechatService } from './wechat.service';

@Module({
  imports: [LoggerModule, CacheModule],
  providers: [WechatService],
  exports: [WechatService],
})
export class WechatModule {}
