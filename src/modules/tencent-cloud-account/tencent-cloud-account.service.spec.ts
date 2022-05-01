import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { TencentCloudAccountModule } from '@/modules/tencent-cloud-account/tencent-cloud-account.module';
import { TencentCloudAccountService } from './tencent-cloud-account.service';

describe('TencentCloudAccountService', () => {
  let service: TencentCloudAccountService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TencentCloudAccountModule],
    }).compile();

    service = module.get<TencentCloudAccountService>(TencentCloudAccountService);
  });

  it('findAll', async () => {
    const result = await service.findAll();
    expect(result).toBeDefined();
  });

  it('cos test', async () => {
    const cosUtil = await service.getCosUtilByAccountId(1);
    const result = await cosUtil.getService({});
    expect(result).toBeDefined();
  });
});
