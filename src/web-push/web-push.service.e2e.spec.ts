import { TEST_ASSETS } from '@/constants/test_constants';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { PushSubscription } from 'web-push';
import { ProxyFetchModule } from '@/libs/proxy-fetch';
import { LoggerModule } from '@/common/logger/logger.module';
import { WebPushService } from './web-push.service';

describe('WebPushService', () => {
  let service: WebPushService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, ProxyFetchModule.forRoot()],
      providers: [WebPushService],
    }).compile();

    service = module.get<WebPushService>(WebPushService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('send notification', async () => {
    const test_str = readFileSync(join(TEST_ASSETS, 'test-push-subscription.json'), 'utf-8');
    const pushSubscription: PushSubscription = JSON.parse(test_str);
    const res = await service.sendNotification(
      pushSubscription,
      JSON.stringify({
        title: 'Your notification title',
        message: 'Your notification body',
      }),
    );
    expect(res).toHaveProperty('status', 201);
  });
});
