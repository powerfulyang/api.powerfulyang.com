import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { LoggerService } from '@/common/logger/logger.service';
import { FeedService } from '@/modules/feed/feed.service';
import { pick } from 'ramda';

@Injectable()
export class EsService {
  constructor(
    private readonly logger: LoggerService,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly feedService: FeedService,
  ) {
    this.logger.setContext(EsService.name);
    // TODO 初始化 index
  }

  async createFeedIndex() {
    const exist = await this.elasticsearchService.indices.exists({ index: 'feeds' });
    if (!exist) {
      await this.elasticsearchService.indices.create(
        {
          index: 'feeds',
          mappings: {
            properties: {
              id: { type: 'integer' },
              content: { type: 'text' },
            },
          },
        },
        { ignore: [400] },
      );
    }
    const feeds = await this.feedService.all();
    const body = feeds.flatMap((feed) => {
      return [{ index: { _index: 'feeds', _id: feed.id } }, pick(['id', 'content'], feed)];
    });
    await this.elasticsearchService.bulk({
      body,
    });
    return this.elasticsearchService.count({ index: 'feeds' });
  }

  deleteFeedIndex() {
    return this.elasticsearchService.indices.delete({
      index: 'feeds',
    });
  }

  async searchFeedByContent(content: string) {
    const results: any[] = [];
    const { hits } = await this.elasticsearchService.search({
      index: 'feeds',
      body: {
        query: {
          match: {
            content: {
              query: content,
            },
          },
        },
      },
    });
    hits.hits.forEach((item) => {
      results.push(item._source);
    });

    return { results, total: hits.hits.length };
  }
}
