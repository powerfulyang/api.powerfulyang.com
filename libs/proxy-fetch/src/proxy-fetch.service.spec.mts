import { Test, TestingModule } from '@nestjs/testing';
import { ProxyFetchService } from './proxy-fetch.service.mjs';

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

  it('test proxy fetch', async function () {
    const res = await service.proxyFetch('https://twitter.com');
    const resText = await res.text();
    expect(resText).toBeDefined();
  });
});
