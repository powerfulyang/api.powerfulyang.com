import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '@/common/logger/logger.service';
import { Feed } from '@/modules/feed/entities/feed.entity';

@Injectable()
export class EsService {
  constructor(
    private readonly logger: LoggerService,
    private readonly elasticsearchService: ElasticsearchService,
    @InjectRepository(Feed) private readonly feedDao: Repository<Feed>,
  ) {
    this.logger.setContext(EsService.name);
    // TODO 初始化 index
  }

  query() {
    return this.elasticsearchService.search();
  }

  async parseAndPrepareData() {
    const body = [] as any[];
    const feeds = await this.feedDao.find();
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
    if (!exist) {
      await this.elasticsearchService.indices.create({
        index: 'feed',
      });
      const body = await this.parseAndPrepareData();
      await this.elasticsearchService.bulk({
        index: 'feed',
        body,
      });
    }
    return exist;
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
