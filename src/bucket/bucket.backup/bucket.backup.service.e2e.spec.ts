import { BucketModule } from '@/bucket/bucket.module';
import { beforeAll, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { BucketBackupService } from './bucket.backup.service';

describe('BucketBackupService', () => {
  let service: BucketBackupService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BucketModule],
    }).compile();

    service = module.get<BucketBackupService>(BucketBackupService);
  });

  it('backup', async () => {
    const result = await service.backup(1);
    expect(result).toBeDefined();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
