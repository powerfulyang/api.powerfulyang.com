import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { AppModule } from '@/app.module';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('query test', async () => {
    const result = await service.query();
    expect(result).toBeDefined();
  });
});
