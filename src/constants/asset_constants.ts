import { join } from 'node:path';
import * as process from 'process';

export const ASSET_DIRNAME = 'assets';

export const ASSET_PATH = join(process.cwd(), ASSET_DIRNAME);

export const getBucketAssetPath = (bucketName: string, key: string = '') => {
  return join(ASSET_PATH, bucketName, key);
};

export const AZUKI_ASSET_PATH = join(ASSET_PATH, 'azuki');

/**
 * path: <rootDir>/assets/emt
 */
export const EMT_ASSET_PATH = join(ASSET_PATH, 'emt');
