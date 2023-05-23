import { LoggerService } from '@/common/logger/logger.service';
import { Injectable } from '@nestjs/common';
import process from 'node:process';
import webPush from 'web-push';

@Injectable()
export class WebPushService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(WebPushService.name);
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    if (privateKey) {
      webPush.setVapidDetails(
        'mailto:i@powerfulyang.com',
        'BDT8NHhgHVZq2UuiNSpGtq4RT62uiC716JDhMjcgpOr6NDG55jobhdjYoqvdHSz1zpPh54VlzjHGarE013WDFOE',
        privateKey,
      );
    }
  }

  sendNotification = webPush.sendNotification.bind(webPush);
}
