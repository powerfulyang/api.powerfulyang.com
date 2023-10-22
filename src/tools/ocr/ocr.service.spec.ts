import { LoggerService } from '@/common/logger/logger.service';
import { OcrService } from '@/tools/ocr/ocrService';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { TEST_ASSETS_IMAGES } from '@/constants/test_constants';

describe('OCR Service', () => {
  let service: OcrService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [OcrService, LoggerService],
    }).compile();

    await module.init();

    service = module.get<OcrService>(OcrService);
  }, 1000 * 100);

  afterAll(async () => {
    await module.close();
  });

  it('eng ocr', async () => {
    const image = join(TEST_ASSETS_IMAGES, 'eng.png');
    const imageBuffer = readFileSync(image);
    const res = await service.recognize(imageBuffer);
    expect(res.text).toContain('hello');
  });

  it('multi ocr', async () => {
    const image = join(TEST_ASSETS_IMAGES, 'multi.png');
    const imageBuffer = readFileSync(image);
    const res = await service.recognize(imageBuffer);
    expect(res.text).toContain(
      '本 文 将 详细 介绍 在 Nodejs 环 境 中 使 用 Tesseract 进 行 光学 字符 识别 (OCR) 的 方法 。\n' +
        'Tesseract 是 一 个 开源 OCR 引擎 ， 可 以 识别 多 种 语言 的 文本 。\n',
    );
  });

  it('chs ocr', async () => {
    const image = join(TEST_ASSETS_IMAGES, 'chs.png');
    const imageBuffer = readFileSync(image);
    const res = await service.recognize(imageBuffer);
    expect(res.text).toContain(
      '这 一 版 本 的 表述 更 加 流畅 ， 有 助 于 读者 更 好 地 理解 本 月 的 科研 项 目 进展 。\n',
    );
  });
});
