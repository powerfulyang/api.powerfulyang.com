import { LoggerService } from '@/common/logger/logger.service';
import { Injectable } from '@nestjs/common';
import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type Tesseract from 'tesseract.js';
import type { ImageLike } from 'tesseract.js';
import { createWorker } from 'tesseract.js';

@Injectable()
export class OCRService implements OnModuleInit, OnModuleDestroy {
  private worker: Tesseract.Worker;

  private engWorker: Tesseract.Worker;

  private chsWorker: Tesseract.Worker;

  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(OCRService.name);
  }

  async onModuleInit() {
    this.worker = await createWorker();
    this.engWorker = await createWorker();
    this.chsWorker = await createWorker();
    await this.worker.loadLanguage('chi_sim+eng');
    await this.worker.initialize('chi_sim+eng');
    await this.engWorker.loadLanguage('eng');
    await this.engWorker.initialize('eng');
    await this.chsWorker.loadLanguage('chi_sim');
    await this.chsWorker.initialize('chi_sim');
  }

  async onModuleDestroy() {
    await this.worker.terminate();
    await this.engWorker.terminate();
    await this.chsWorker.terminate();
  }

  async recognize(url: ImageLike) {
    const result = await this.worker.detect(url);
    const { script } = result.data;
    if (script === 'Han') {
      const res = await this.chsWorker.recognize(url);
      return res.data;
    }
    const res = await this.engWorker.recognize(url);
    return res.data;
  }
}
