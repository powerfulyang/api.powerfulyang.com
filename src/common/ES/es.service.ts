import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { LoggerService } from '@/common/logger/logger.service';
import { pick } from 'ramda';
import { PostService } from '@/modules/post/post.service';

export const POST_INDEX = 'posts';

@Injectable()
export class EsService {
  constructor(
    private readonly logger: LoggerService,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly postService: PostService,
  ) {
    this.logger.setContext(EsService.name);
  }

  async createPostIndex() {
    const exist = await this.elasticsearchService.indices.exists({ index: POST_INDEX });
    if (!exist) {
      await this.elasticsearchService.indices.create(
        {
          index: POST_INDEX,
          mappings: {
            properties: {
              id: { type: 'integer' },
              content: { type: 'text' },
              title: { type: 'text' },
            },
          },
        },
        { ignore: [400] },
      );
    }
    const posts = await this.postService.all();
    const body = posts.flatMap((post) => {
      return [
        { index: { _index: POST_INDEX, _id: post.id } },
        pick(['id', 'content', 'title'], post),
      ];
    });
    const result = await this.elasticsearchService.bulk({
      body,
    });
    return result.items.length;
  }

  deletePostIndex() {
    return this.elasticsearchService.indices.delete({
      index: POST_INDEX,
    });
  }

  async searchPostByContent(content: string) {
    const results: any[] = [];
    const { hits } = await this.elasticsearchService.search({
      index: POST_INDEX,
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
