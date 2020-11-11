import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { GithubModule } from 'app/github-webhook/github.module';

describe('GithubService', () => {
  let service: GithubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GithubModule],
    }).compile();

    service = module.get<GithubService>(GithubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
