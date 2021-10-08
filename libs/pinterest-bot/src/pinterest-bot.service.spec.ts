import { Test, TestingModule } from '@nestjs/testing';
import { PinterestBotService } from './pinterest-bot.service';
import { PinterestBotModule } from './pinterest-bot.module';
import { ProxyFetchModule } from 'api/proxy-fetch';

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
