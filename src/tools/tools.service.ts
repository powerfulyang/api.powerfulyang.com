import { LoggerService } from '@/common/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ProxyFetchService } from 'api/proxy-fetch';

@Injectable()
export class ToolsService {
  constructor(
    private readonly logger: LoggerService,
    private readonly proxyFetchService: ProxyFetchService,
  ) {
    this.logger.setContext(ToolsService.name);
  }

  download(url: string) {
    return this.proxyFetchService.yt_dlp(url);
  }
}
