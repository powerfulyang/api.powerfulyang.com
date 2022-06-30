import { Injectable } from '@nestjs/common';
import { EsService } from '@/common/service/ES/es.service';
import type { ElasticsearchService } from '@nestjs/elasticsearch';
import type { LogstashSource } from '@/common/service/ES/types/LogstashSource';
import { LoggerService } from '@/common/logger/logger.service';

@Injectable()
export class LogsViewerService {
  private readonly es: ElasticsearchService;

  constructor(readonly esService: EsService, private readonly logger: LoggerService) {
    this.logger.setContext(LoggerService.name);
    this.es = esService.getEsClient();
  }

  async listContainers() {
    const result = await this.es.search<LogstashSource>({
      index: 'logstash-*',
      query: {
        match_all: {},
      },
      collapse: {
        field: 'container_name.keyword',
      },
    });
    const containerNames = result.hits.hits.map((item) => {
      return item._source?.container_name;
    });
    this.logger.debug(`Found ${containerNames.length} containers, names: ${containerNames.join()}`);
    return containerNames;
  }

  async showContainerLogs(containerName: string) {
    const result = await this.es.search<LogstashSource>({
      index: 'logstash-*',
      query: {
        match: {
          'container_name.keyword': containerName,
        },
      },
      size: 1000,
    });
    const logs = result.hits.hits.map((item) => {
      return item._source?.message;
    });
    this.logger.debug(`Found ${logs.length} logs for container ${containerName}`);
    return logs;
  }
}
