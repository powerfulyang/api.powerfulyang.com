import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { LoggerService } from '@/common/logger/logger.service';

export const POST_INDEX = 'posts';

@Injectable()
export class EsService {
  constructor(
    private readonly logger: LoggerService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {
    this.logger.setContext(EsService.name);
  }

  getEsClient() {
    return this.elasticsearchService;
  }

  showAllIndex() {
    return this.elasticsearchService.indices.get({
      index: '_all',
    });
  }

  deleteIndex(index: string) {
    return this.elasticsearchService.indices.delete({
      index,
    });
  }

  inspectLogstash() {
    return this.elasticsearchService.cat.indices({
      index: 'logstash-*',
      format: 'json',
    });
  }
}
