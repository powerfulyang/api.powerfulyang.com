import process from 'node:process';
import { Injectable } from '@nestjs/common';
import { GraphQLClient } from 'graphql-request';
import { LoggerService } from '@/common/logger/logger.service';
import type { QueryReposQuery } from '@/libs/github/__generated__/github-graphql';
import { getSdk } from '@/libs/github/__generated__/github-graphql';
import type { NonNullableElement } from '@/type/NonNullableElement';

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

  async queryContributions(login?: string) {
    const res = await getSdk(this.client).queryContributions({ login });
    return res.user;
  }

  async queryRepositories(login?: string) {
    let hasNextPage = true;
    let after: string | null = null;
    const repositories: NonNullableElement<
      NonNullable<QueryReposQuery['user']>['repositories']['nodes']
    > = [];
    while (hasNextPage) {
      const res = await getSdk(this.client).queryRepos({
        login,
        cursor: after,
      });
      if (!res.user) {
        return [];
      }
      hasNextPage = res.user.repositories.pageInfo.hasNextPage;
      after = res.user.repositories.pageInfo.endCursor;
      res.user.repositories.nodes?.forEach((node) => {
        if (node) {
          repositories.push(node);
        }
      });
    }
    return repositories;
  }

  async userInfo(login?: string) {
    const userContributes = await this.queryContributions(login);
    const calendar = userContributes?.contributionsCollection.contributionCalendar.weeks
      .flatMap((week) => week.contributionDays)
      .map((week) => ({
        contributionCount: week.contributionCount,
        contributionLevel: week.contributionLevel,
        date: new Date(week.date),
      }));
    const contributesLanguage: Record<
      string,
      { language: string; color: string; contributions: number }
    > =
      userContributes?.contributionsCollection.commitContributionsByRepository
        .filter((repo) => repo.repository.primaryLanguage)
        .reduce((acc: Record<string, any>, repo) => {
          const language = repo.repository.primaryLanguage?.name || '';
          const color = repo.repository.primaryLanguage?.color || 'OTHER_COLOR';
          const contributions = repo.contributions.totalCount;
          if (acc[language]) {
            // eslint-disable-next-line no-param-reassign
            acc[language].contributions += contributions;
          } else {
            // eslint-disable-next-line no-param-reassign
            acc[language] = {
              language,
              color,
              contributions,
            };
          }
          return acc;
        }, {}) || {};
    const languages = Object.values(contributesLanguage).sort(
      (obj1, obj2) => -obj1.contributions + obj2.contributions,
    );
    const totalForkCount = await this.queryRepositories(login).then((repos) =>
      repos.map((node) => node?.forkCount || 0).reduce((num1, num2) => num1 + num2, 0),
    );
    const totalStargazerCount = await this.queryRepositories(login).then((repos) => {
      return repos.map((node) => node?.stargazerCount || 0).reduce((num1, num2) => num1 + num2, 0);
    });
    return {
      contributionCalendar: calendar,
      contributesLanguage: languages,
      totalForkCount,
      totalStargazerCount,
      totalCommitContributions: userContributes?.contributionsCollection.totalCommitContributions,
      totalIssueContributions: userContributes?.contributionsCollection.totalIssueContributions,
      totalPullRequestContributions:
        userContributes?.contributionsCollection.totalPullRequestContributions,
      totalPullRequestReviewContributions:
        userContributes?.contributionsCollection.totalPullRequestReviewContributions,
    };
  }
}
