import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { COS_UPLOAD_MSG_PATTERN } from '../constants/constants';

@Controller()
export class UploadStaticController {
    @MessagePattern(COS_UPLOAD_MSG_PATTERN)
    async getNotifications(@Payload() data: number[]) {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 10000);
        });
        console.log(Date.now() / 1000);
        console.log(data.toString());
    }
}
