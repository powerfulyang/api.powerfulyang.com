import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ChatGptModule } from '@app/chat-gpt/chat-gpt.module';
import { ChatGptService } from './chat-gpt.service';

describe('ChatGptService', () => {
  let service: ChatGptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ChatGptModule],
    }).compile();

    service = module.get<ChatGptService>(ChatGptService);
  });

  it('send Message', async () => {
    const res = await service.sendMessage('hello');
    expect(res).toBeDefined();
  });

  it('send Message by bing ai', async () => {
    const res = await service.sendMessageWithBingAI('hello');
    expect(res).toBeDefined();
  });
});
