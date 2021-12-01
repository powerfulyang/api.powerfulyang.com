import { Module } from '@nestjs/common';
import { GithubService } from './github.service.mjs';
import { GithubController } from './github.controller.mjs';

@Module({
  providers: [GithubService],
  controllers: [GithubController],
})
export class GithubModule {}
