import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ProxyFetchModule } from 'api/proxy-fetch';
import { PinterestBotService } from './pinterest-bot.service';
import { PinterestBotModule } from './pinterest-bot.module';

describe('PinterestRssService', () => {
  let service: PinterestBotService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProxyFetchModule.forRoot(), PinterestBotModule],
    }).compile();

    service = module.get<PinterestBotService>(PinterestBotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
