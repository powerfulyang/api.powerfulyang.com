import { Module } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger';

@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}
