import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PathViewCountService } from '@/modules/path-view-count/path-view-count.service';
import { PathViewCountModule } from '@/modules/path-view-count/path-view-count.module';

describe('BucketService', () => {
  let service: PathViewCountService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PathViewCountModule],
    }).compile();

    service = module.get<PathViewCountService>(PathViewCountService);
  });

  it('cache test', async () => {
    const results = await service.initPathViewCountCache();
    expect(results).toBeDefined();
  });

  it('handle page view count', async () => {
    const count = await service.handlePathViewCount('/public/post', '127.0.0.1');
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
