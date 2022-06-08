import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { EsModule } from '@/common/ES/es.module';
import { EsService } from './es.service';

describe('SearchService', () => {
  let service: EsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EsModule],
    }).compile();

    service = module.get<EsService>(EsService);
  });

  it('ES post index and search', async () => {
    const count = await service.createPostIndex();
    expect(count).toBeDefined();

    const result = await service.searchPostByContent('test');
    expect(result).toBeDefined();
  });

  it('show all index', async () => {
    const result = await service.showAllIndex();
    expect(result).toBeDefined();
  });

  it('inspectLogstashIndex', async () => {
    const result = await service.inspectLogstash();
    expect(result).toBeDefined();
  });
});
