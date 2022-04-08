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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
