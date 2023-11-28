import { TEST_ASSETS_IMAGES } from '@/constants/test_constants';
import { getEXIFFormatted } from '@/lib/exif';
import { AmapModule } from '@/libs/amap/amap.module';
import { AmapService } from '@/libs/amap/amap.service';
import { beforeAll, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('amap', () => {
  let service: AmapService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AmapModule],
    }).compile();

    await module.init();

    service = module.get<AmapService>(AmapService);
  });

  it('regeo', async () => {
    const res = await service.regeo('121.46773,31.212108');
    expect(res).toHaveProperty('status', '1');
  });

  it('weatherReport', async () => {
    const res = await service.weatherReport();
    expect(res).toHaveProperty('status', '1');
  });

  it('weatherLive', async () => {
    const res = await service.weatherLive();
    expect(res).toHaveProperty('status', '1');
  });

  it('image exif gps info', async () => {
    const testFile = join(TEST_ASSETS_IMAGES, 'private', 'test-exif.jpg');
    if (existsSync(testFile)) {
      const file = readFileSync(testFile);
      const exif = await getEXIFFormatted(file);
      expect(exif).toBeDefined();
      const { gcj02Longitude, gcj02Latitude } = exif!;
      const location = await service.regeo(`${gcj02Longitude},${gcj02Latitude}`);
      expect(location.formatted_address).toBeDefined();
    }
  });
});
