import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { TencentCloudAccountModule } from '@/modules/tencent-cloud-account/tencent-cloud-account.module';
import { TencentCloudAccountService } from './tencent-cloud-account.service';

describe('TencentCloudAccountService', () => {
  let service: TencentCloudAccountService;
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [TencentCloudAccountModule],
    }).compile();

    service = app.get<TencentCloudAccountService>(TencentCloudAccountService);
  });

  afterAll(() => {
    app.close();
  });

  it('findAll', async () => {
    const result = await service.findAll();
    expect(result).toBeDefined();
  });
});
