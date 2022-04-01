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

  it('query test', async () => {
    const result = await service.query();
    expect(result).toBeDefined();
  });

  it('index feed', async () => {
    const result = await service.createFeedIndex();
    expect(result).toBeDefined();
  });

  it('delete feed index', async () => {
    const result = await service.deleteFeedIndex();
    expect(result).toBeDefined();
  });

  it('ES feed', async () => {
    const result = await service.searchFeedByContent('我的第一条说说! #第一条说说');
    expect(result).toBeDefined();
  });
});
