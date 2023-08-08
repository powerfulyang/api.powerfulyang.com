import fs from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import type { Message } from 'firebase-admin/messaging';
import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import { LoggerService } from '@/common/logger/logger.service';

@Injectable()
export class FcmService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(FcmService.name);
    const serviceAccount = join(process.cwd(), '.credentials/serviceAccountKey.json');
    try {
      fs.accessSync(serviceAccount);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // 其他配置参数
      });
    } catch (error) {
      // ignore
    }
  }

  subscribe() {}

  sendNotification(message: Message) {
    // 使用 Firebase Admin SDK 发送通知
    return admin.messaging().send(message);
  }
}
