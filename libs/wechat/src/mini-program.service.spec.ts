import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { LoggerModule } from '@/common/logger/logger.module';
import { CacheModule } from '@/common/cache/cache.module';
import { MiniProgramService } from '@app/wechat/mini-program.service';

describe('mini-program service', () => {
  let service: MiniProgramService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, CacheModule],
      providers: [MiniProgramService],
    }).compile();

    service = module.get<MiniProgramService>(MiniProgramService);
  });

  it('replySubscribeMessage', async () => {
    const result = await service.replySubscribeMessage({
      touser: 'o2mym5Thvbe231mZSYiBXdhhwNrM',
      template_id: 'k-EspzqmrO2YOZ9ZQCEKwA5ptCYXjQits4k-aJeokaw',
      page: 'pages/index/index',
      miniprogram_state: 'trial',
      data: {
        phrase2: {
          value: '上海',
        },
        date1: {
          value: '2021-01-01',
        },
        phrase3: {
          value: '晴',
        },
        character_string4: {
          value: '20℃',
        },
        thing5: {
          value: '请注意防护',
        },
      },
    });
    expect(result).toBeDefined();
  });
});
