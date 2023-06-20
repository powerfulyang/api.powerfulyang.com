import { beforeAll, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ProxyFetchModule } from '@/libs/proxy-fetch/proxy-fetch.module';
import { ProxyFetchService } from '@/libs/proxy-fetch/proxy-fetch.service';

describe('proxy', () => {
  let service: ProxyFetchService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProxyFetchModule.forRoot()],
    }).compile();

    service = module.get<ProxyFetchService>(ProxyFetchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
