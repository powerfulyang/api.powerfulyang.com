import { LoggerService } from '@/common/logger/logger.service';
import { ProxyFetchService } from '@/libs/proxy-fetch/proxy-fetch.service';
import { OcrService } from '@/tools/ocr/ocrService';
import { Injectable } from '@nestjs/common';
import { sha1 } from '@powerfulyang/node-utils';
import { join } from 'node:path';
import process from 'node:process';
import type { ImageLike } from 'tesseract.js';

@Injectable()
export class ToolsService {
  private readonly proxyUri: string = '';

  constructor(
    private readonly logger: LoggerService,
    private readonly proxyFetchService: ProxyFetchService,
    private readonly ocrService: OcrService,
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

  async ocr(imageBuffer: ImageLike) {
    const result = await this.ocrService.recognize(imageBuffer);
    return result.text;
  }
}
