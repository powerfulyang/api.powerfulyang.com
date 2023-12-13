import { wgs84togcj02 } from 'coordtransform';
import dayjs from 'dayjs';
import sharp from 'sharp';
import exifReader from 'exif-reader';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const getEXIF = async (file: Buffer | string) => {
  const s = sharp(file);
  const metadata = await s.metadata();
  const { exif } = metadata;
  if (!exif) {
    return null;
  }
  return exifReader(exif);
};

export const convertDegreeToDecimal = (degree?: number[]) => {
  if (!degree) {
    return undefined;
  }
  const [d, m, s] = degree;
  return d + m / 60 + s / 3600;
};

export const getEXIFFormatted = async (file: Buffer) => {
  const exif = await getEXIF(file);
  if (!exif) {
    return null;
  }
  // format: [116, 59, 60] => 116°59′60″
  const _latitude = exif.GPSInfo?.GPSLatitude;
  const latitude = convertDegreeToDecimal(_latitude);
  const _longitude = exif.GPSInfo?.GPSLongitude;
  const longitude = convertDegreeToDecimal(_longitude);
  const altitude = exif.GPSInfo?.GPSAltitude;

  let gcj02Latitude: number | undefined;
  let gcj02Longitude: number | undefined;
  if (latitude && longitude) {
    [gcj02Longitude, gcj02Latitude] = wgs84togcj02(longitude, latitude);
  }
  const DateTimeOriginal = exif.Photo?.DateTimeOriginal;
  const OffsetTimeOriginal = exif.Photo?.OffsetTimeOriginal;

  // dayjs format: 2021-08-21 16:00:00
  const createDateTime =
    DateTimeOriginal && OffsetTimeOriginal
      ? dayjs(DateTimeOriginal).utc(false).format('YYYY-MM-DD HH:mm:ss')
      : undefined;

  return {
    latitude,
    longitude,
    altitude,
    gcj02Latitude,
    gcj02Longitude,
    make: exif.Image?.Make,
    model: exif.Image?.Model,
    // 型号
    modelName: exif.Image?.['39424'],
    orientation: exif.Image?.Orientation,
    createDateTime,
  };
};
