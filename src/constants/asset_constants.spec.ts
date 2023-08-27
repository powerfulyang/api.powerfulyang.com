import { ASSET_DIR, getBucketAssetPath } from '@/constants/asset_constants';
import { describe, expect, it } from '@jest/globals';
import { join } from 'node:path';

describe('AssetConstants', () => {
  it('getBucketAssetPath', () => {
    const bucketPath = getBucketAssetPath('bucketName');
    expect(bucketPath).toContain(join(ASSET_DIR, 'bucketName'));
    const assetPath = getBucketAssetPath('bucketName', 'key');
    expect(assetPath).toContain(join(ASSET_DIR, 'bucketName', 'key'));
  });
});
