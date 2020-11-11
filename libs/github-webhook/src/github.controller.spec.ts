import { Test, TestingModule } from '@nestjs/testing';
import { GithubController } from './github.controller';
import { GithubModule } from 'app/github-webhook/github.module';

describe('Github Controller', () => {
  let controller: GithubController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GithubModule],
    }).compile();

    controller = module.get<GithubController>(GithubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
