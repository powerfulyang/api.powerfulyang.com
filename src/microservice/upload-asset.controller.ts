import { Controller } from '@nestjs/common';
import {
    Ctx,
    MessagePattern,
    Payload,
    RmqContext,
} from '@nestjs/microservices';
import { COS_UPLOAD_MSG_PATTERN } from '@/constants/constants';
import { UploadAssetService } from './upload-asset.service';

@Controller()
export class UploadAssetController {
    constructor(private uploadStaticService: UploadAssetService) {}

    @MessagePattern(COS_UPLOAD_MSG_PATTERN)
    async getNotifications(
        @Payload() data: number[],
        @Ctx() context: RmqContext,
    ) {
        await this.uploadStaticService.persistent(data.toString());
        const message = context.getMessage();
        const channel = context.getChannelRef();
        return channel.ack(message);
    }
}
