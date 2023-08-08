import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard, PublicAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { BodyPagination } from '@/common/decorator/pagination/pagination.decorator';
import { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { AuthUser } from '@/common/decorator/user-from-auth.decorator';
import { LoggerService } from '@/common/logger/logger.service';
import { User } from '@/user/entities/user.entity';
import { NotificationDto } from '@/web-push/dto/Notification.dto';
import { PushSubscriptionLogService } from '@/web-push/push-subscription-log/push-subscription-log.service';
import { PushSubscriptionJSONDto } from '@/web-push/dto/PushSubscriptionJSON.dto';
import { WebPushService } from '@/web-push/web-push.service';

@Controller('web-push')
@PublicAuthGuard()
@ApiTags('web-push')
export class WebPushController {
  constructor(
    private readonly logger: LoggerService,
    private readonly pushSubscriptionLogService: PushSubscriptionLogService,
    private readonly webPushService: WebPushService,
  ) {
    this.logger.setContext(WebPushController.name);
  }

  @Post('subscribe')
  @ApiOperation({
    summary: '订阅推送',
    operationId: 'webPushSubscribe',
  })
  subscribe(@Body() subscription: PushSubscriptionJSONDto, @AuthUser() user?: User) {
    return this.pushSubscriptionLogService.subscribe(user, subscription);
  }

  @Post('subscribe/list')
  @ApiOperation({
    summary: '订阅推送列表',
    operationId: 'webPushSubscribeList',
  })
  @AdminAuthGuard()
  list(@BodyPagination() pagination: PaginatedBaseQuery) {
    return this.pushSubscriptionLogService.list(pagination);
  }

  @Post('send-notification')
  @ApiOperation({
    summary: '发送推送',
    operationId: 'webPushSendNotification',
  })
  @AdminAuthGuard()
  async sendNotification(@Body() notification: NotificationDto) {
    const { subscribeId, ...rest } = notification;
    const subscription = await this.pushSubscriptionLogService.findOne(subscribeId);
    return this.webPushService.sendNotification(
      subscription.pushSubscriptionJSON,
      JSON.stringify(rest),
    );
  }
}
