import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PixivBotModule } from 'api/pixiv-bot/pixiv-bot.module';
import { ProxyFetchModule } from 'api/proxy-fetch';
import { PixivBotService } from './pixiv-bot.service';

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
