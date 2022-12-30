import { Module } from '@nestjs/common';
import { LoggerModule } from '@/common/logger/logger.module';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';

@Module({
  imports: [LoggerModule],
  providers: [GithubService],
  controllers: [GithubController],
})
export class GithubModule {}
