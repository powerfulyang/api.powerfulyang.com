import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { LoggerService } from '@/common/logger/logger.service';
import { FeedService } from '@/modules/feed/feed.service';

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

  private async parseAndPrepareData() {
    const body = [] as any[];
    const feeds = await this.feedService.all();
    feeds.forEach((item) => {
      body.push(
        { index: { _index: 'feed', _id: item.id } },
        {
          content: item.content,
          id: item.id,
        },
      );
    });
    return body;
  }

  async createFeedIndex() {
    const exist = await this.elasticsearchService.indices.exists({ index: 'feed' });
    if (exist) {
      await this.deleteFeedIndex();
    }
    await this.elasticsearchService.indices.create({
      index: 'feed',
    });
    const body = await this.parseAndPrepareData();
    const res = await this.elasticsearchService.bulk({
      body,
    });
    return res.items;
  }

  deleteFeedIndex() {
    return this.elasticsearchService.indices.delete({
      index: 'feed',
    });
  }

  async searchFeedByContent(content: string) {
    const results: any[] = [];
    const { hits } = await this.elasticsearchService.search({
      index: 'feed',
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
