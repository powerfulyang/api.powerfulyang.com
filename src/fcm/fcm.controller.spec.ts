import { beforeEach, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { LoggerService } from '@/common/logger/logger.service';
import { FcmController } from './fcm.controller';
import { FcmService } from './fcm.service';

describe('FcmController', () => {
  let controller: FcmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FcmController],
      providers: [FcmService, LoggerService],
    })
      .overrideProvider(FcmService)
      .useValue({})
      .compile();

    controller = module.get<FcmController>(FcmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
