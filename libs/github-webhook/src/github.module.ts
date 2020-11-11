import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';

@Module({
  providers: [GithubService],
  controllers: [GithubController],
})
export class GithubModule {}
