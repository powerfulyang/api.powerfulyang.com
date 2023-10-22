import { LoggerService } from '@/common/logger/logger.service';
import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type Tesseract from 'tesseract.js';
import type { ImageLike } from 'tesseract.js';
import { createWorker } from 'tesseract.js';

@Injectable()
export class OcrService implements OnModuleInit, OnModuleDestroy {
  private worker: Tesseract.Worker;

  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(OcrService.name);
  }

  async onModuleInit() {
    this.worker = await createWorker('chi_sim+eng');
  }

  async onModuleDestroy() {
    await this.worker.terminate();
  }

  async recognize(url: ImageLike) {
    const res = await this.worker.recognize(url);
    return res.data;
  }
}
