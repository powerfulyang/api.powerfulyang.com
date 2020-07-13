import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { COS_UPLOAD_MSG_PATTERN } from '../constants/constants';
import { UploadStaticService } from './upload-static.service';

@Controller()
export class UploadStaticController {
    constructor(private uploadStaticService: UploadStaticService) {}

    @MessagePattern(COS_UPLOAD_MSG_PATTERN)
    async getNotifications(@Payload() data: number[], @Ctx() context: RmqContext) {
        await this.uploadStaticService.persistent(data.toString());
        const message = context.getMessage();
        const channel = context.getChannelRef();
        return channel.ack(message);
    }
}
