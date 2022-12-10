import { Module } from '@nestjs/common';
import { LoggerModule } from '@/common/logger/logger.module';
import { CacheModule } from '@/common/cache/cache.module';
import { MiniProgramService } from '@app/wechat/mini-program.service';
import { MiniProgramController } from '@app/wechat/mini-program.controller';
import { WeatherModule } from '@app/weather';
import { OfficialAccountController } from '@app/wechat/official-account.controller';
import { ChatGptModule } from '@app/chat-gpt';
import { OfficialAccountService } from './official-account.service';

@Module({
  imports: [LoggerModule, CacheModule, WeatherModule, ChatGptModule],
  providers: [MiniProgramService, OfficialAccountService],
  exports: [MiniProgramService, OfficialAccountService],
  controllers: [MiniProgramController, OfficialAccountController],
})
export class WechatModule {}
