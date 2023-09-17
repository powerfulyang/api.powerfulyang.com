import { ASSET_DIRNAME, getBucketAssetPath } from '@/constants/asset_constants';
import { describe, expect, it } from '@jest/globals';
import { join } from 'node:path';

describe('AssetConstants', () => {
  it('getBucketAssetPath', () => {
    const bucketPath = getBucketAssetPath('bucketName');
    expect(bucketPath).toContain(join(ASSET_DIRNAME, 'bucketName'));
    const assetPath = getBucketAssetPath('bucketName', 'key');
    expect(assetPath).toContain(join(ASSET_DIRNAME, 'bucketName', 'key'));
  });
});
