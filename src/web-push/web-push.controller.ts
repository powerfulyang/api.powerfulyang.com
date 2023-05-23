import { PublicAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { AuthUser } from '@/common/decorator/user-from-auth.decorator';
import { LoggerService } from '@/common/logger/logger.service';
import { User } from '@/modules/user/entities/user.entity';
import { PushSubscriptionLogService } from '@/web-push/push-subscription-log/push-subscription-log.service';
import { PushSubscriptionJSON } from '@/web-push/PushSubscriptionJSON';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('web-push')
@PublicAuthGuard()
@ApiTags('web-push')
export class WebPushController {
  constructor(
    private readonly logger: LoggerService,
    private readonly pushSubscriptionLogService: PushSubscriptionLogService,
  ) {
    this.logger.setContext(WebPushController.name);
  }

  @Post('subscribe')
  @ApiOperation({
    summary: '订阅推送',
    operationId: 'webPushSubscribe',
  })
  subscribe(@Body() subscription: PushSubscriptionJSON, @AuthUser() user: User) {
    return this.pushSubscriptionLogService.subscribe(user, subscription);
  }
}
