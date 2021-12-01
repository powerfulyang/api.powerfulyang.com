import { Test, TestingModule } from '@nestjs/testing';
import { TencentCloudAccountService } from './tencent-cloud-account.service.mjs';

describe('TencentCloudAccountService', () => {
  let service: TencentCloudAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TencentCloudAccountService],
    }).compile();

    service = module.get<TencentCloudAccountService>(TencentCloudAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
