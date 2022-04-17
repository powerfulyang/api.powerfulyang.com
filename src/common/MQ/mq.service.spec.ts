import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { MqService } from '@/common/MQ/mq.service';
import { MqModule } from '@/common/MQ/mq.module';

describe('AssetService', () => {
  let service: MqService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MqModule],
    }).compile();

    service = module.get<MqService>(MqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
