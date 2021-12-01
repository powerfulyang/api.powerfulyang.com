import { Module } from '@nestjs/common';
import { ConfigService } from './config.service.mjs';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
