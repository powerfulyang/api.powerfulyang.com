import { beforeEach, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { FcmModule } from '@/fcm/fcm.module';
import { FcmService } from './fcm.service';

describe('FcmService', () => {
  let service: FcmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FcmModule],
    }).compile();

    service = module.get<FcmService>(FcmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
