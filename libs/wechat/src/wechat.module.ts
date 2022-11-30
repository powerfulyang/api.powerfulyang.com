import { Module } from '@nestjs/common';
import { LoggerModule } from '@/common/logger/logger.module';
import { CacheModule } from '@/common/cache/cache.module';
import { MiniProgramService } from '@app/wechat/mini-program.service';
import { MiniProgramController } from '@app/wechat/mini-program.controller';
import { WechatService } from './wechat.service';

@Module({
  imports: [LoggerModule, CacheModule],
  providers: [WechatService, MiniProgramService],
  exports: [WechatService, MiniProgramService],
  controllers: [MiniProgramController],
})
export class WechatModule {}
