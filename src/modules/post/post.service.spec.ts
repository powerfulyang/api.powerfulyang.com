import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PostModule } from '@/modules/post/post.module';
import type { User } from '@/modules/user/entities/user.entity';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PostModule],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('create new post', async () => {
    const res = await service.createPost({
      content: 'test content',
      title: 'test title',
      createBy: {
        id: 1,
      } as User,
      posterId: 12,
    });
    expect(res.public).toBe(false);
    const post = await service.readPost(res.id, [res.createBy.id]);
    expect(post).toHaveProperty('content', 'test content');
    const result = await service.deletePost(res);
    expect(result).not.toBeDefined();
  });

  it('getPosts', async () => {
    const res = await service.queryPosts({ publishYear: 2021 });
    expect(res).toBeDefined();
  });

  it('getPublishedTags', async () => {
    const res = await service.queryPublishedTags();
    expect(res).toBeDefined();
  });

  it('getPublishedYears', async () => {
    const res = await service.queryPublishedYears();
    expect(res).toBeDefined();
  });
});
