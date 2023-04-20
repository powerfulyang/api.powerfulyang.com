import { LoggerService } from '@/common/logger/logger.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
