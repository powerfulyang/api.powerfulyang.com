import { Test, TestingModule } from '@nestjs/testing';
import { PathViewCountService } from '@/modules/path.view.count/path.view.count.service';
import { AppModule } from '@/app.module';

describe('BucketService', () => {
  let service: PathViewCountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<PathViewCountService>(PathViewCountService);
  });

  it('cache test', async () => {
    const results = await service.cache();
    expect(results).toBeDefined();
  });

  it('handle page view count', async function () {
    const count = await service.handlePathViewCount('/posts/1', '127.0.0.1');
    expect(count);
  });
});
