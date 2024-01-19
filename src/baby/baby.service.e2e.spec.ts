import { BabyController } from '@/baby/baby.controller';
import { BabyModule } from '@/baby/baby.module';
import { BabyService } from '@/baby/baby.service';
import { beforeAll, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

describe('BabyService', () => {
  let service: BabyService;
  let controller: BabyController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BabyModule],
    }).compile();

    service = module.get<BabyService>(BabyService);
    controller = module.get<BabyController>(BabyController);
  });

  it('create bucket', async () => {
    const result = await service.createBucket({
      name: 'test',
      domain: 'test-r2.littleeleven.com',
    });
    expect(result).toBeDefined();
  });

  it('upload', async () => {
    const result = await service.upload({
      data: Buffer.from('test'),
      encoding: 'utf-8',
      filename: 'test',
      mimetype: 'text/plain',
    });
    expect(result).toBeDefined();
  });

  it('post moment', async () => {
    const result = await service.createMoment({
      content: 'test',
      type: 'moment',
      uploadIds: [1],
    });
    expect(result).toBeDefined();
  });

  it('query moments', async () => {
    const result = await controller.queryMoments({});
    expect(result).toBeDefined();
  });
});
