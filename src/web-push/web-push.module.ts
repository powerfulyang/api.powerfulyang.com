import { LoggerModule } from '@/common/logger/logger.module';
import { OrmModule } from '@/common/service/orm/orm.module';
import { PushSubscriptionLog } from '@/web-push/entities/PushSubscriptionLog.entity';
import { PushSubscriptionLogService } from '@/web-push/push-subscription-log/push-subscription-log.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebPushService } from './web-push.service';
import { WebPushController } from './web-push.controller';

@Module({
  imports: [OrmModule, LoggerModule, TypeOrmModule.forFeature([PushSubscriptionLog])],
  controllers: [WebPushController],
  providers: [WebPushService, PushSubscriptionLogService],
})
export class WebPushModule {}
