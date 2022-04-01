import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { InstagramBotModule } from 'api/instagram-bot/instagram-bot.module';
import { ProxyFetchModule } from 'api/proxy-fetch';
import { InstagramBotService } from './instagram-bot.service';

describe('InstagramBotService', () => {
  let service: InstagramBotService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProxyFetchModule.forRoot(), InstagramBotModule],
    }).compile();

    service = module.get<InstagramBotService>(InstagramBotService);
  });

  it('should fetch all saved be defined', async () => {
    await expect(service.fetchUndo().then((res) => res.pop()!.id)).resolves.toBe('B6sOwipIji0');
  });

  it('should fetch undo saved be defined', async () => {
    const res = await service.fetchUndo();
    expect(res).toBeDefined();
  });
});
