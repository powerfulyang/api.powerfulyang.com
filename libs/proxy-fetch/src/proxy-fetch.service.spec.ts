import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ProxyFetchService } from './proxy-fetch.service';

describe('ProxyFetchService', () => {
  let service: ProxyFetchService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProxyFetchService],
    }).compile();

    service = module.get<ProxyFetchService>(ProxyFetchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('test proxy fetch', async () => {
    const res = await service.proxyFetch('https://twitter.com');
    const resText = await res.text();
    expect(resText).toBeDefined();
  });
});
