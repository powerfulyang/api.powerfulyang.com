import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppLogger } from '@/common/logger/app.logger';
import { UploadFileMsg } from '@/type/UploadFile';
import { AssetService } from '@/modules/asset/asset.service';
import { MessagePatterns } from '@/constants/MessagePatterns';

@Controller()
export class UploadAssetController {
  constructor(private readonly assetService: AssetService, private readonly logger: AppLogger) {
    this.logger.setContext(UploadAssetController.name);
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
