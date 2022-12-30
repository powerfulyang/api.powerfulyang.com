import { LoggerService } from '@/common/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { getSdk } from 'app/github/__generated__/github-graphql';
import { GraphQLClient } from 'graphql-request';

@Injectable()
export class GithubService {
  private readonly client = new GraphQLClient('https://api.github.com/graphql', {
    headers: {
      authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });

  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(GithubService.name);
  }

  async queryContributions(login: string) {
    const res = await getSdk(this.client).queryContributions({ login });
    return res.user;
  }
}
