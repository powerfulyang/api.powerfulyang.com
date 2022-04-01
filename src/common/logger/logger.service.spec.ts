import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { LoggerService } from '@/common/logger/logger.service';
import { LoggerModule } from '@/common/logger/logger.module';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
    }).compile();

    service = await module.resolve<LoggerService>(LoggerService);
  });

  it('init', () => {
    const error = new Error('error message!');
    service.error(error);
    service.warn('test');
    service.info('test');
    service.debug('test');
    service.verbose('test');
  });
});
