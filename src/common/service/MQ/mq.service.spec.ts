import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { MqService } from '@/common/service/MQ/mq.service';
import { MqModule } from '@/common/service/MQ/mq.module';

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
