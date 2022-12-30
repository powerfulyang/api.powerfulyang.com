import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { GithubModule } from './github.module';
import { GithubService } from './github.service';

describe('GithubService', () => {
  let service: GithubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GithubModule],
    }).compile();

    service = module.get<GithubService>(GithubService);
  });

  it('repos', async () => {
    const repos = await service.queryContributions('powerfulyang');
    expect(repos).toBeDefined();
  });
});
