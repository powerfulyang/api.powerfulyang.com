import { LoggerService } from '@/common/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ProxyFetchService } from '@/libs/proxy-fetch';
import process from 'node:process';
import type { PushSubscription } from 'web-push';
import webPush from 'web-push';

@Injectable()
export class WebPushService {
  constructor(
    private readonly logger: LoggerService,
    private readonly proxyFetchService: ProxyFetchService,
  ) {
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

  sendNotification(subscription: PushSubscription, payload?: string) {
    const generateRequestDetails = webPush.generateRequestDetails(subscription, payload);
    return this.proxyFetchService.proxyFetch(generateRequestDetails.endpoint, {
      method: generateRequestDetails.method,
      headers: generateRequestDetails.headers,
      body: generateRequestDetails.body,
    });
  }
}
