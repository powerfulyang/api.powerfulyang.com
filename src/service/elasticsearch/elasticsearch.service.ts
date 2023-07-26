import { LoggerService } from '@/common/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService as _ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticsearchService {
  constructor(
    private readonly elasticsearchService: _ElasticsearchService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(ElasticsearchService.name);
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
