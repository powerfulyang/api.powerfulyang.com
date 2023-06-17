import { TEST_ASSETS_IMAGES } from '@/constants/test_constants';
import { ToolsModule } from '@/tools/tools.module';
import { ToolsService } from '@/tools/tools.service';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('HelloService', () => {
  let service: ToolsService;
  let module: TestingModule;

  beforeAll(async () => {
    jest.setTimeout(1000 * 10);
    module = await Test.createTestingModule({
      imports: [ToolsModule],
    }).compile();

    await module.init();

    service = module.get<ToolsService>(ToolsService);
  }, 1000 * 10);

  afterAll(async () => {
    await module.close();
  });

  it('ocr', async () => {
    const image = join(TEST_ASSETS_IMAGES, 'img.png');
    const imageBuffer = readFileSync(image);
    const res = await service.ocr(imageBuffer);
    expect(res).toContain('hello');
  });
});
