import { Injectable } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(
    private readonly logger: AppLogger,
    private readonly elasticsearchService: ElasticsearchService,
  ) {
    this.logger.setContext(SearchService.name);
  }

  query() {
    return this.elasticsearchService.search();
  }
}
