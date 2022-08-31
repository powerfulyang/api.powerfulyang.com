import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { EsModule } from '@/common/service/ES/es.module';
import { EsService } from './es.service';

describe('SearchService', () => {
  let service: EsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EsModule],
    }).compile();

    service = module.get<EsService>(EsService);
  });

  it('show all index', async () => {
    const result = await service.showAllIndex();
    expect(result).toBeDefined();
  });
});
