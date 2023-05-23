import { WebPushModule } from '@/web-push/web-push.module';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PushSubscriptionLogService } from './push-subscription-log.service';

describe('PushSubscriptionLogService', () => {
  let service: PushSubscriptionLogService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [WebPushModule],
    }).compile();

    service = module.get<PushSubscriptionLogService>(PushSubscriptionLogService);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
