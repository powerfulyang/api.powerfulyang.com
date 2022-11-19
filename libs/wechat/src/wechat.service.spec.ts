import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { LoggerModule } from '@/common/logger/logger.module';
import { CacheModule } from '@/common/cache/cache.module';
import { WechatService } from './wechat.service';

describe('WechatService', () => {
  let service: WechatService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, CacheModule],
      providers: [WechatService],
    }).compile();

    service = module.get<WechatService>(WechatService);
  });

  it('generateAccessToken', async () => {
    const accessToken = await service.generateAccessToken();
    expect(accessToken).toBeDefined();
  });

  it('createTmpQrcode', async () => {
    const qrcodeUrl = await service.createTmpQrcode();
    expect(qrcodeUrl).toBeDefined();
  });
});
