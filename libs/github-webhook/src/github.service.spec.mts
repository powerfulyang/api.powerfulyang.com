import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service.mjs';
import { GithubModule } from 'app/github-webhook/github.module.mjs';

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
