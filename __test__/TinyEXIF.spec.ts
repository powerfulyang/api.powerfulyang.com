import { getEXIF } from '../addon.api';
import { join } from 'path';
import sharp from 'sharp';

describe('C艹', () => {
  it('getEXIF', async () => {
    const path = join(process.cwd(), 'assets', 'test.jpg');
    const metadata = await sharp(path).metadata();
    const exif = getEXIF(path);
    expect(metadata.width).toBe(exif.ImageWidth);
  });
});
