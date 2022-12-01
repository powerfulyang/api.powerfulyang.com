import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { LoggerModule } from '@/common/logger/logger.module';
import { CacheModule } from '@/common/cache/cache.module';
import { MiniProgramService } from '@app/wechat/mini-program.service';
import { WeatherModule } from '@app/weather';

describe('mini-program service', () => {
  let service: MiniProgramService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, CacheModule, WeatherModule],
      providers: [MiniProgramService],
    }).compile();

    service = module.get<MiniProgramService>(MiniProgramService);
  });

  it('replySubscribeMessage', async () => {
    const toUser = 'o2mym5Thvbe231mZSYiBXdhhwNrM';
    const result = await service.replyTodayWeather(toUser);
    expect(result).toBeDefined();
  });
});
