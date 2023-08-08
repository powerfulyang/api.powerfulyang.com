import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PushSubscriptionLog } from '@/web-push/entities/push-subscription-log.entity';
import { User } from '@/user/entities/user.entity';
import { LoggerModule } from '@/common/logger/logger.module';
import { PushSubscriptionLogService } from './push-subscription-log.service';

describe('PushSubscriptionLogService', () => {
  let service: PushSubscriptionLogService;
  const findOne = jest.fn();
  const save = jest.fn();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        PushSubscriptionLogService,
        {
          provide: getRepositoryToken(PushSubscriptionLog),
          useValue: {
            findOne,
            save,
          },
        },
      ],
    }).compile();

    service = module.get<PushSubscriptionLogService>(PushSubscriptionLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('subscribe', async () => {
    const endpoint = 'https://example.com';
    const pushSubscriptionJSON = {
      endpoint,
      keys: {
        p256dh: 'p256dh',
        auth: 'auth',
      },
    };
    const user = new User();
    findOne.mockReturnValueOnce(null);
    save.mockReturnValueOnce({
      id: 1,
      endpoint,
      pushSubscriptionJSON,
      user,
    });
    const pushSubscriptionLog = await service.subscribe(user, pushSubscriptionJSON);
    expect(findOne).toBeCalledTimes(1);
    expect(save).toBeCalledTimes(1);
    expect(pushSubscriptionLog).toEqual({
      id: 1,
      endpoint,
      pushSubscriptionJSON,
      user,
    });
  });
});
