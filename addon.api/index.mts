import type { Exif } from './types/Exif';

const api = require('bindings')('api');

export const getEXIF = (path: string): Exif => {
  return api.getEXIF(path);
};
