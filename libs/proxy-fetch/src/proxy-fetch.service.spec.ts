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

  it('timeout 1ms', async () => {
    const p = service.proxyFetch(`https://google.com`, {
      timeout: 1,
    });
    await expect(p).rejects.toThrow();
  });
});
