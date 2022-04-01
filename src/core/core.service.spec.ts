import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { CoreService } from '@/core/core.service';
import { CoreModule } from '@/core/core.module';

describe('core service test', () => {
  let service: CoreService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();

    service = module.get<CoreService>(CoreService);
  });

  it('setCommonNodeUuid', async () => {
    const bool = await service.isProdScheduleNode();
    expect(bool).toBeFalsy();
  });
});
