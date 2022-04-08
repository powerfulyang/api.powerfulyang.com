import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { TelegramBotModule } from 'api/telegram-bot/telegram-bot.module';
import { TelegramBotService } from './telegram-bot.service';

describe('TelegramBotService', () => {
  let service: TelegramBotService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TelegramBotModule],
    }).compile();

    service = module.get<TelegramBotService>(TelegramBotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
