import { CacheModule } from '@/common/cache/cache.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { ChatGptModule } from '@app/chat-gpt';
import { WeatherModule } from '@app/weather';
import { MiniProgramController } from '@app/wechat/mini-program.controller';
import { MiniProgramService } from '@app/wechat/mini-program.service';
import { OfficialAccountController } from '@app/wechat/official-account.controller';
import { Module } from '@nestjs/common';
import { OfficialAccountService } from './official-account.service';

@Module({
  imports: [LoggerModule, CacheModule, WeatherModule, ChatGptModule],
  providers: [MiniProgramService, OfficialAccountService],
  exports: [MiniProgramService, OfficialAccountService],
  controllers: [MiniProgramController, OfficialAccountController],
})
export class WechatModule {}
