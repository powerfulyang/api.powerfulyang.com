import { LoggerModule } from '@/common/logger/logger.module';
import { Module } from '@nestjs/common';
import { WebPushService } from './web-push.service';
import { WebPushController } from './web-push.controller';

@Module({
  imports: [LoggerModule],
  controllers: [WebPushController],
  providers: [WebPushService],
})
export class WebPushModule {}
