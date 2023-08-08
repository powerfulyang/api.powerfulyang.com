import { Module } from '@nestjs/common';
import { LoggerModule } from '@/common/logger/logger.module';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

@Module({
  imports: [LoggerModule],
  providers: [GithubService],
  controllers: [GithubController],
})
export class GithubModule {}
