import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { COS_UPLOAD_MSG_PATTERN } from '@/constants/constants';
import { AppLogger } from '@/common/logger/app.logger';
import { UploadFileMsg } from '@/type/UploadFile';
import { UploadAssetService } from './upload-asset.service';

@Controller()
export class UploadAssetController {
  constructor(private uploadStaticService: UploadAssetService, private logger: AppLogger) {
    this.logger.setContext(UploadAssetController.name);
  }

  @MessagePattern(COS_UPLOAD_MSG_PATTERN)
  async getNotifications(@Payload() data: UploadFileMsg, @Ctx() context: RmqContext) {
    this.logger.info(`${this.getNotifications.name} ---> to persistent ${JSON.stringify(data)}`);
    await this.uploadStaticService.persistent(data);
    const message = context.getMessage();
    const channel = context.getChannelRef();
    return channel.ack(message);
  }
}
