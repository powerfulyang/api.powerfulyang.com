import process from 'node:process';
import { beforeAll, describe, expect, it } from '@jest/globals';
import type { Provider } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { TMT_ACCOUNT } from '@/constants/PROVIDER_TOKEN';
import { LoggerService } from '@/common/logger/logger.service';
import { WordBookService } from './word-book.service';

describe('WordBookService', () => {
  let service: WordBookService;

  const TencentCloudAccountProvider: Provider = {
    provide: TMT_ACCOUNT,
    useValue: {
      SecretId: process.env.TMT_TENCENT_CLOUD_SECRET_ID,
      SecretKey: process.env.TMT_TENCENT_CLOUD_SECRET_KEY,
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WordBookService, TencentCloudAccountProvider, LoggerService],
    }).compile();

    service = module.get<WordBookService>(WordBookService);
  });

  it('translate', async () => {
    const res = await service.translate('hello');
    expect(res).toBe('你好');
  });
});
