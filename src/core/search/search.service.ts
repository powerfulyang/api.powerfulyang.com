import { Injectable } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feed } from '@/modules/feed/entities/feed.entity';

@Injectable()
export class SearchService {
  constructor(
    private readonly logger: AppLogger,
    private readonly elasticsearchService: ElasticsearchService,
    @InjectRepository(Feed) private readonly feedDao: Repository<Feed>,
  ) {
    this.logger.setContext(SearchService.name);
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
    const checkIndex = await this.elasticsearchService.indices.exists({ index: 'feed' });
    if (checkIndex.statusCode === 404) {
      this.elasticsearchService.indices.create(
        {
          index: 'feed',
          body: {
            settings: {
              analysis: {
                analyzer: {
                  autocomplete_analyzer: {
                    tokenizer: 'autocomplete',
                    filter: ['lowercase'],
                  },
                  autocomplete_search_analyzer: {
                    tokenizer: 'keyword',
                    filter: ['lowercase'],
                  },
                },
                tokenizer: {
                  autocomplete: {
                    type: 'edge_ngram',
                    min_gram: 1,
                    max_gram: 30,
                    token_chars: ['letter', 'digit', 'whitespace'],
                  },
                },
              },
            },
            mappings: {
              properties: {
                id: { type: 'integer' },
                content: {
                  type: 'text',
                  fields: {
                    complete: {
                      type: 'text',
                      analyzer: 'autocomplete_analyzer',
                      search_analyzer: 'autocomplete_search_analyzer',
                    },
                  },
                },
              },
            },
          },
        },
        (err) => {
          if (err) {
            this.logger.error('error', err);
          }
        },
      );
      const body = await this.parseAndPrepareData();
      this.elasticsearchService.bulk(
        {
          index: 'feed',
          body,
        },
        (err) => {
          if (err) {
            this.logger.error('error', err);
          }
        },
      );
    }
    return checkIndex.statusCode;
  }

  deleteFeedIndex() {
    return this.elasticsearchService.indices.delete({
      index: 'feed',
    });
  }

  async searchFeedByContent(content: string) {
    const results: any[] = [];
    const { body } = await this.elasticsearchService.search({
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
    const { hits } = body.hits;
    hits.forEach((item) => {
      results.push(item._source);
    });

    return { results, total: body.hits.total.value };
  }
}
