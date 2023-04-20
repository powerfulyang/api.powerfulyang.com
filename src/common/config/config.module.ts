import { LoggerModule } from '@/common/logger/logger.module';
import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  imports: [LoggerModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
