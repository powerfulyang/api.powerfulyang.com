import { Module } from '@nestjs/common';
import { CacheModule } from '@/common/cache/cache.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { WeatherModule } from '@/libs/weather';
import { MiniProgramController } from '@/libs/wechat/mini-program.controller';
import { MiniProgramService } from '@/libs/wechat/mini-program.service';
import { OfficialAccountController } from '@/libs/wechat/official-account.controller';
import { OfficialAccountService } from './official-account.service';

@Module({
  imports: [LoggerModule, CacheModule, WeatherModule],
  providers: [MiniProgramService, OfficialAccountService],
  exports: [MiniProgramService, OfficialAccountService],
  controllers: [MiniProgramController, OfficialAccountController],
})
export class WechatModule {}
