import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import type { Message } from 'firebase-admin/messaging';
import { join } from 'node:path';
import process from 'node:process';
import admin from 'firebase-admin';

@Injectable()
export class FcmService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(FcmService.name);
    const serviceAccount = join(process.cwd(), '.credentials/serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // 其他配置参数
    });
  }

  subscribe() {}

  sendNotification(message: Message) {
    // 使用 Firebase Admin SDK 发送通知
    return admin.messaging().send(message);
  }
}
