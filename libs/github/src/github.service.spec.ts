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

  it('contributions', async () => {
    const contributions = await service.queryContributions();
    expect(contributions).toBeDefined();
  });

  it('repositories', async () => {
    const repositories = await service.queryRepositories();
    expect(repositories).toBeDefined();
  });
});
