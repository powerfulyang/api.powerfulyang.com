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

  it('node check', async () => {
    const isProdScheduleNode = await service.isProdScheduleNode();
    expect(isProdScheduleNode).toBeFalsy();
    const isScheduleNode = await service.isScheduleNode();
    expect(isScheduleNode).toBeFalsy();
  });

  it('run algolia crawler', async () => {
    const taskId = await service.reindexAlgoliaCrawler();
    expect(taskId).toBeDefined();
  });
});
