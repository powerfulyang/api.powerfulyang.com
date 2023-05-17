import { LoggerService } from '@/common/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { sha1 } from '@powerfulyang/node-utils';
import { ProxyFetchService } from 'api/proxy-fetch';
import { join } from 'node:path';
import process from 'node:process';

@Injectable()
export class ToolsService {
  private readonly proxyUri: string = '';

  constructor(
    private readonly logger: LoggerService,
    private readonly proxyFetchService: ProxyFetchService,
  ) {
    this.logger.setContext(ToolsService.name);
    this.proxyUri = this.proxyFetchService.proxyUri;
  }

  yt_dlp(url: string) {
    const hash = sha1(url);
    const downloadPath = join(process.cwd(), `assets/yt-dlp/${hash}.%(ext)s`);
    const getFilenameCommand = `yt-dlp ${url} --proxy '${this.proxyUri}' --output '${downloadPath}' --get-filename`;
    const downloadCommand = `yt-dlp ${url} --proxy '${this.proxyUri}' --output '${downloadPath}'`;
    return {
      getFilenameCommand,
      downloadCommand,
    };
  }
}
