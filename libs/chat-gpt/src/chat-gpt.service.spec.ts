import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ChatGptService } from './chat-gpt.service';

describe('ChatGptService', () => {
  let service: ChatGptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGptService],
    }).compile();

    service = module.get<ChatGptService>(ChatGptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
