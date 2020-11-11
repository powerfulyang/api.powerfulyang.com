import { Test, TestingModule } from '@nestjs/testing';
import { InstagramBotService } from './instagram-bot.service';
import { InstagramBotModule } from 'api/instagram-bot/instagram-bot.module';
import { ProxyFetchModule } from 'api/proxy-fetch';

describe('InstagramBotService', () => {
  let service: InstagramBotService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProxyFetchModule, InstagramBotModule],
    }).compile();

    service = module.get<InstagramBotService>(InstagramBotService);
  });

  it('should fetch all saved be defined', async () => {
    await expect(service.fetchUndo().then((res) => res.pop()!.id)).resolves.toBe('B6sOwipIji0');
  });

  it('should fetch undo saved be defined', async () => {
    await expect(service.fetchUndo('CFfMG6eBAyh').then((res) => res.pop()!.id)).resolves.toBe(
      'CF4guRfB61D',
    );
  });
});
