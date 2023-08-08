import { Module } from '@nestjs/common';
import { LoggerModule } from '@/common/logger/logger.module';
import { FcmService } from './fcm.service';
import { FcmController } from './fcm.controller';

@Module({
  imports: [LoggerModule],
  controllers: [FcmController],
  providers: [FcmService],
})
export class FcmModule {}
