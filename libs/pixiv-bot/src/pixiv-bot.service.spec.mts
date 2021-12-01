import { Test, TestingModule } from '@nestjs/testing';
import { PixivBotService } from './pixiv-bot.service.mjs';
import { PixivBotModule } from 'api/pixiv-bot/pixiv-bot.module.mjs';
import { ProxyFetchModule } from 'api/proxy-fetch/index.mjs';

describe('PixivBotService', () => {
  let service: PixivBotService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProxyFetchModule.forRoot(), PixivBotModule],
    }).compile();

    service = module.get<PixivBotService>(PixivBotService);
  });

  it('should be defined', async () => {
    const res = await service.fetchUndo();
    expect(res).toBeDefined();
  });
});
