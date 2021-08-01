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

  it('index feed', async function () {
    const result = await service.createFeedIndex();
    expect(result).toBeDefined();
  });

  it('search feed', async function () {
    const result = await service.searchFeedByContent('我的第一条说说! #第一条说说');
    expect(result).toBeDefined();
  });
});
