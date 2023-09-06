import { Module } from '@nestjs/common';
import { CacheModule } from '@/common/cache/cache.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { WeatherModule } from '@/libs/weather';
import { MiniProgramService } from './mini-program.service';
import { OfficialAccountController } from './official-account.controller';
import { MiniProgramController } from './mini-program.controller';
import { OfficialAccountService } from './official-account.service';

@Module({
  imports: [LoggerModule, CacheModule, WeatherModule],
  providers: [MiniProgramService, OfficialAccountService],
  exports: [MiniProgramService, OfficialAccountService],
  controllers: [MiniProgramController, OfficialAccountController],
})
export class WechatModule {}
