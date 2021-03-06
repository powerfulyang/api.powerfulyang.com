import { Test, TestingModule } from '@nestjs/testing';
import { PinterestRssService } from './pinterest-rss.service';
import { PinterestRssModule } from 'api/pinterest-rss/pinterest-rss.module';
import { ProxyFetchModule } from 'api/proxy-fetch';

describe('PinterestRssService', () => {
  let service: PinterestRssService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProxyFetchModule, PinterestRssModule],
    }).compile();

    service = module.get<PinterestRssService>(PinterestRssService);
  });

  it('should get undo posts', async () => {
    await expect(
      service.fetchUndo('836262224552035684').then((res) => res.pop()!.id),
    ).resolves.toStrictEqual('836262224552037400');
  });
});
