import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { TencentCloudAccountModule } from '@/modules/tencent-cloud-account/tencent-cloud-account.module';
import { TencentCloudAccountService } from '@/modules/tencent-cloud-account/tencent-cloud-account.service';
import type { TencentCloudCosService } from 'api/tencent-cloud-cos/tencent-cloud-cos.service';
import { readFileSync } from 'fs';
import { HttpStatus } from '@nestjs/common';

describe('TencentCloudAccountService', () => {
  let accountService: TencentCloudAccountService;
  let app: TestingModule;
  let cosUtil: TencentCloudCosService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [TencentCloudAccountModule],
    }).compile();

    accountService = app.get<TencentCloudAccountService>(TencentCloudAccountService);
    cosUtil = await accountService.getCosUtilByAccountId(1);
  });

  afterAll(() => {
    app.close();
  });

  it('cos:GetService', () => {
    const result = cosUtil.getService({});
    expect(result).toBeDefined();
  });

  it('cos:getObjectUrl', async () => {
    const result = await cosUtil.getService({});
    const bucket = result.Buckets[0];
    const file = readFileSync(`${process.cwd()}/assets/test.jpg`);
    const putObjectResult = await cosUtil.putObject({
      Key: 'test.jpg',
      Bucket: bucket.Name,
      Region: bucket.Location,
      Body: file,
    });
    expect(putObjectResult.statusCode).toBe(HttpStatus.OK);
    const getObjectUrlResult = await cosUtil.getSignedObjectUrl({
      Bucket: bucket.Name,
      Region: bucket.Location,
      Key: 'test.jpg',
    });
    expect(getObjectUrlResult.original).toBeDefined();
  });
});
