import { WebPushModule } from '@/web-push/web-push.module';
import { beforeEach, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import type { PushSubscription } from 'web-push';
import { WebPushService } from './web-push.service';

describe('WebPushService', () => {
  let service: WebPushService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WebPushModule],
    }).compile();

    service = module.get<WebPushService>(WebPushService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('send notification', async () => {
    const test_str = readFileSync(
      join(process.cwd(), '__test__', 'test-push-subscription.json'),
      'utf-8',
    );
    const pushSubscription: PushSubscription = JSON.parse(test_str);
    const res = await service.sendNotification(
      pushSubscription,
      JSON.stringify({
        title: 'Your notification title',
        message: 'Your notification body',
      }),
    );
    expect(res).toHaveProperty('statusCode', 201);
  });
});
