import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@/common/logger/logger.module';
import { OrmModule } from '@/service/typeorm/orm.module';
import { PushSubscriptionLog } from '@/web-push/entities/push-subscription-log.entity';
import { PushSubscriptionLogService } from '@/web-push/push-subscription-log/push-subscription-log.service';
import { ProxyFetchModule } from '@/libs/proxy-fetch';
import { WebPushService } from './web-push.service';
import { WebPushController } from './web-push.controller';

@Module({
  imports: [
    OrmModule,
    LoggerModule,
    TypeOrmModule.forFeature([PushSubscriptionLog]),
    ProxyFetchModule.forRoot(),
  ],
  controllers: [WebPushController],
  providers: [WebPushService, PushSubscriptionLogService],
})
export class WebPushModule {}
