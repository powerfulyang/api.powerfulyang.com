import { PixivBotModule } from '@/libs/pixiv-bot/pixiv-bot.module';
import { PixivBotService } from '@/libs/pixiv-bot/pixiv-bot.service';
import { beforeAll, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

describe('pixiv-bot', () => {
  let service: PixivBotService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PixivBotModule],
    }).compile();

    service = module.get<PixivBotService>(PixivBotService);
  });

  it('fetchUndo', async () => {
    const undoes = await service.fetchUndo();
    expect(undoes).toBeDefined();
  });
});
