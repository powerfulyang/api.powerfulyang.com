import { LoggerService } from '@/common/logger/logger.service';
import { OCRService } from '@/tools/ocr/ocr.service';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { TEST_ASSETS_IMAGES } from '@/constants/test_constants';

describe('OCR Service', () => {
  let service: OCRService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [OCRService, LoggerService],
    }).compile();

    await module.init();

    service = module.get<OCRService>(OCRService);
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
      '本 文 将 详 线 仁 绍 在 Nodejs 环 境 中 借 用 fesseract 逼 行 光 学 字 符 识 别 (OCR) 的 方 法\n' +
        'Tasseract 怠 一 个 开 源 OCR 引 孽 , 可 以 泓 别 多 种 语 言 的 文 本',
    );
  });

  it('chs ocr', async () => {
    const image = join(TEST_ASSETS_IMAGES, 'chs.png');
    const imageBuffer = readFileSync(image);
    const res = await service.recognize(imageBuffer);
    expect(res.text).toContain(
      '这 一 版 本 的 表 述 更 加 流 畅 , 有 助 于 读 者 更 好 地 理 解 本 月 的 科 研 项 目 迹 展 。',
    );
  });
});
