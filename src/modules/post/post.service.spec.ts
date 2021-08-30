import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { AppModule } from '@/app.module';

describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getPublishedYears', async () => {
    const res = await service.getPublishedYears();
    expect(res).toBeDefined();
  });
});
