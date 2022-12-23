import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PathViewCountService } from '@/modules/path-view-count/path-view-count.service';
import { PathViewCountModule } from '@/modules/path-view-count/path-view-count.module';

describe('PathViewCountService', () => {
  let service: PathViewCountService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PathViewCountModule],
    }).compile();

    service = module.get<PathViewCountService>(PathViewCountService);
  });

  it('view count', async () => {
    const result = await service.viewCount();
    expect(result).toBeInstanceOf(Array);
  });
});
