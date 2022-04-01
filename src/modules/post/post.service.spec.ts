import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PostService } from './post.service';
import { PostModule } from '@/modules/post/post.module';
import { SUCCESS } from '@/constants/constants';

describe('PostService', () => {
  let service: PostService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PostModule],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('create new post', async () => {
    const res = await service.publishPost({
      content: 'test content',
      title: 'test title',
      createBy: {
        id: 1,
      },
    });
    expect(res).toBeDefined();
    const post = await service.readPost(res.id, [res.createBy.id]);
    expect(post).toHaveProperty('content', 'test content');
    const result = await service.deletePost(res);
    expect(result).toBe(SUCCESS);
  });

  it('getPosts', async () => {
    const res = await service.queryPosts({ publishYear: 2021 });
    expect(res).toBeDefined();
  });

  it('getPublishedTags', async () => {
    const res = await service.getPublishedTags();
    expect(res).toBeDefined();
  });

  it('getPublishedYears', async () => {
    const res = await service.getPublishedYears();
    expect(res).toBeDefined();
  });
});
