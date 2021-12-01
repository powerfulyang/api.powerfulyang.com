import { Test, TestingModule } from '@nestjs/testing';
import { PinterestBotService } from './pinterest-bot.service.mjs';
import { PinterestBotModule } from './pinterest-bot.module.mjs';
import { ProxyFetchModule } from 'api/proxy-fetch/index.mjs';

describe('PinterestRssService', () => {
  let service: PinterestBotService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProxyFetchModule.forRoot(), PinterestBotModule],
    }).compile();

    service = module.get<PinterestBotService>(PinterestBotService);
  });

  it('should get undo posts', async () => {
    const res = await service.fetchUndo();
    expect(res).toBeDefined();
  });
});
