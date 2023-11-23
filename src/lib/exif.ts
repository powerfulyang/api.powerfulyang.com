import sharp from 'sharp';
import exifReader from 'exif-reader';

export const getEXIF = async (file: Buffer) => {
  const s = sharp(file);
  const metadata = await s.metadata();
  const { exif } = metadata;
  if (!exif) {
    return null;
  }
  return exifReader(exif);
};
