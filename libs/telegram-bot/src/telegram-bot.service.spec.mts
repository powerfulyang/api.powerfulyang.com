import { Test, TestingModule } from '@nestjs/testing';
import { TelegramBotService } from './telegram-bot.service.mjs';
import { ProxyFetchModule } from 'api/proxy-fetch/index.mjs';
import { TelegramBotModule } from 'api/telegram-bot/telegram-bot.module.mjs';

describe('TelegramBotService', () => {
  let service: TelegramBotService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProxyFetchModule.forRoot(), TelegramBotModule],
    }).compile();

    service = module.get<TelegramBotService>(TelegramBotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('bot send message', async function () {
    await expect(service.sendToMe('我是机器人')).resolves.toHaveProperty('text', '我是机器人');
  });
});
