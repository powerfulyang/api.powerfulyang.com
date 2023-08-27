import { join } from 'node:path';
import * as process from 'process';

export const ASSET_DIR = 'assets';

export const ASSET_PATH = join(process.cwd(), ASSET_DIR);

export const getBucketAssetPath = (bucketName: string, key: string = '') => {
  return join(ASSET_PATH, bucketName, key);
};
