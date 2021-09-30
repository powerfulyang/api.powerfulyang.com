import { Test, TestingModule } from '@nestjs/testing';
import { TencentCloudAccountController } from './tencent-cloud-account.controller';
import { TencentCloudAccountService } from './tencent-cloud-account.service';

describe('TencentCloudAccountController', () => {
  let controller: TencentCloudAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TencentCloudAccountController],
      providers: [TencentCloudAccountService],
    }).compile();

    controller = module.get<TencentCloudAccountController>(TencentCloudAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
