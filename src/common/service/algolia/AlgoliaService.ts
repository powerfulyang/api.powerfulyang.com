import { LoggerService } from '@/common/logger/logger.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import process from 'node:process';

@Injectable()
export class AlgoliaService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(AlgoliaService.name);
  }

  private getAuthHeader(userString: string) {
    return {
      Authorization: `Basic ${Buffer.from(userString).toString('base64')}`,
    };
  }

  // trigger algolia sync
  async reindexAlgoliaCrawler() {
    const crawlerId = process.env.ALGOLIA_CRAWLER_ID;
    const crawlerUserId = process.env.ALGOLIA_CRAWLER_USER_ID;
    const crawlerApiKey = process.env.ALGOLIA_CRAWLER_API_KEY;
    if (!crawlerId || !crawlerUserId || !crawlerApiKey) {
      // ignore if no crawler id
      return null;
    }
    const headers = this.getAuthHeader(`${crawlerUserId}:${crawlerApiKey}`);
    // run a crawler
    const res = await fetch(`https://crawler.algolia.com/api/1/crawlers/${crawlerId}/reindex`, {
      method: 'POST',
      headers,
    });
    if (res.status !== HttpStatus.OK) {
      throw new Error('run algolia crawler failed');
    }
    const json = await res.json();
    if (json.taskId) {
      return json.taskId;
    }
    throw new Error('run algolia crawler failed');
  }
}
