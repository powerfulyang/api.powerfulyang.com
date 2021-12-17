import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import '@/loadEnv';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
