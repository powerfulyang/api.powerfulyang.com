import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { EsService } from './es.service';
import { EsModule } from '@/common/ES/es.module';

describe('SearchService', () => {
  let service: EsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EsModule],
    }).compile();

    service = module.get<EsService>(EsService);
  });

  it('ES feed', async () => {
    const items = await service.createFeedIndex();
    expect(items).toBeDefined();
    const result = await service.searchFeedByContent('test');
    expect(result).toBeDefined();
    const res = await service.deleteFeedIndex();
    expect(res.acknowledged).toBe(true);
  });
});