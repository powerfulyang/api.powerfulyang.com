import { PinterestBotModule } from '@/libs/pinterest-bot/pinterest-bot.module';
import { PinterestBotService } from '@/libs/pinterest-bot/pinterest-bot.service';
import { beforeAll, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

describe('pinterest-bot', () => {
  let service: PinterestBotService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PinterestBotModule],
    }).compile();

    service = module.get<PinterestBotService>(PinterestBotService);
  });

  it('fetchUndo', async () => {
    const undoes = await service.fetchUndo();
    expect(undoes).toBeDefined();
  });
});
