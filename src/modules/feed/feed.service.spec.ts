import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { FeedModule } from '@/modules/feed/feed.module';
import type { User } from '@/modules/user/entities/user.entity';
import { FeedService } from './feed.service';

describe('FeedService', () => {
  let service: FeedService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FeedModule],
    }).compile();

    service = module.get<FeedService>(FeedService);
  });

  it('postNewFeed', async () => {
    const result = await service.postNewFeed({ content: 'test', createBy: <User>{ id: 1 } });
    expect(result.content).toBe('test');
    const res = await service.updateFeed(result.id, { content: 'test2' });
    expect(res).toBeDefined();
  });

  it('infiniteQuery', async () => {
    let result = await service.infiniteQuery();
    while (result.nextCursor) {
      result = await service.infiniteQuery({
        nextCursor: result.nextCursor,
      });
      expect(result.resources).toBeDefined();
    }
  });
});
