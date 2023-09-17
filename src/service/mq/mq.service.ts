import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MICROSERVICE_NAME } from '@/constants/constants';
import { MessagePatterns } from '@/constants/MessagePatterns';
import type { UploadFileMsg } from '@/type/UploadFile';
import type TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class MqService {
  constructor(@Inject(MICROSERVICE_NAME) private readonly microserviceClient: ClientProxy) {}

  notifyUploadToCos(notification: UploadFileMsg) {
    return this.microserviceClient.emit(MessagePatterns.COS_UPLOAD_MSG_PATTERN, notification);
  }

  hello() {
    return this.microserviceClient.emit(MessagePatterns.HELLO, 'hello');
  }

  notifyHandleFeed(msg: TelegramBot.Message) {
    return this.microserviceClient.emit(MessagePatterns.FEED_HANDLE_MSG_PATTERN, msg);
  }
}
