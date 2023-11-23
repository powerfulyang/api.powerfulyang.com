import { TEST_ASSETS_IMAGES } from '@/constants/test_constants';
import { getEXIF } from '@/lib/exif';
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('lib utils', () => {
  it('exif', async () => {
    const testFile = join(TEST_ASSETS_IMAGES, 'private', 'test-exif.jpg');
    if (existsSync(testFile)) {
      const file = readFileSync(testFile);
      const exif = await getEXIF(file);
      expect(exif).toBeDefined();
    }

    const testFile2 = join(TEST_ASSETS_IMAGES, 'chs.png');
    const file = readFileSync(testFile2);
    const exif = await getEXIF(file);
    expect(exif).toBeNull();
  });
});
