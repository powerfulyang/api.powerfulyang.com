import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import { readFileSync } from 'fs';
import { join } from 'path';
import HashUtils from '../utils/HashUtils';

describe('min_image', () => {
  it('minImageGetSameBuffer', async () => {
    const file = readFileSync(
      join(process.cwd(), 'src', '____test____', './2.png'),
    );
    const minFileBuffer1 = await imagemin.buffer(file, {
      plugins: [
        imageminMozjpeg({
          quality: 50,
        }),
        imageminPngquant({
          quality: [0.5, 0.6],
        }),
      ],
    });
    const hash1 = HashUtils.sha1Hex(minFileBuffer1);
    const minFileBuffer2 = await imagemin.buffer(file, {
      plugins: [
        imageminMozjpeg({
          quality: 50,
        }),
        imageminPngquant({
          quality: [0.5, 0.6],
        }),
      ],
    });
    const hash2 = HashUtils.sha1Hex(minFileBuffer2);
    expect(hash1).toBe(hash2);
    expect(HashUtils.sha1Hex(file)).toBe(HashUtils.sha1Hex(file.slice()))
  });
});
