import { LoggerService } from '@/common/logger/logger.service';
import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { sha1, threadPool } from '@powerfulyang/node-utils';
import { ProxyFetchService } from '@/libs/proxy-fetch';
import { join } from 'node:path';
import process from 'node:process';
import type Tesseract from 'tesseract.js';
import type { ImageLike } from 'tesseract.js';
import { createWorker } from 'tesseract.js';

@Injectable()
export class ToolsService implements OnModuleInit, OnModuleDestroy {
  private readonly proxyUri: string = '';

  private engWorker: Tesseract.Worker;

  private chsWorker: Tesseract.Worker;

  constructor(
    private readonly logger: LoggerService,
    private readonly proxyFetchService: ProxyFetchService,
  ) {
    this.logger.setContext(ToolsService.name);
    this.proxyUri = this.proxyFetchService.proxyUri;
  }

  async onModuleInit() {
    this.engWorker = await createWorker();
    await this.engWorker.loadLanguage('eng');
    await this.engWorker.initialize('eng');
    this.chsWorker = await createWorker();
    await this.chsWorker.loadLanguage('chi_sim');
    await this.chsWorker.initialize('chi_sim');
  }

  async onModuleDestroy() {
    await this.engWorker.terminate();
    await this.chsWorker.terminate();
    await threadPool.destroy();
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

  image2ascii(url: string) {
    const hash = sha1(url);
    const downloadPath = join(process.cwd(), `assets/image2ascii/${hash}.txt`);
    const downloadCommand = `image2ascii ${url} --proxy '${this.proxyUri}' --output '${downloadPath}'`;
    return {
      downloadCommand,
    };
  }

  async ocr(url: ImageLike, language: string = 'eng') {
    if (language === 'eng') {
      const res = await this.engWorker.recognize(url);
      return res.data.text;
    }
    if (language === 'chi_sim') {
      const res = await this.chsWorker.recognize(url);
      return res.data.text;
    }
    throw new Error('Not Support Language');
  }
}
