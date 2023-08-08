import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { LoggerService } from '@/common/logger/logger.service';
import { MessagePatterns } from '@/constants/MessagePatterns';
import { AssetService } from '@/asset/asset.service';
import { UploadFileMsg } from '@/type/UploadFile';

@Controller()
export class UploadAssetController {
  constructor(
    private readonly assetService: AssetService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(UploadAssetController.name);
  }

  @MessagePattern(MessagePatterns.HELLO)
  hello(@Ctx() context: RmqContext) {
    this.logger.debug('Hello');
    const message = context.getMessage();
    const channel = context.getChannelRef();
    channel.ack(message);
    return 'hello';
  }

  @MessagePattern(MessagePatterns.COS_UPLOAD_MSG_PATTERN)
  async getNotifications(@Payload() data: UploadFileMsg, @Ctx() context: RmqContext) {
    this.logger.info(`${this.getNotifications.name} ---> to persistent ${JSON.stringify(data)}`);
    await this.assetService.persistentToCos(data);
    const message = context.getMessage();
    const channel = context.getChannelRef();
    return channel.ack(message);
  }
}
