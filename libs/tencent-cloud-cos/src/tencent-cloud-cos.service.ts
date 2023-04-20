import { AssetStyles } from '@/modules/asset/entities/asset.entity';
import { is_TEST_BUCKET_ONLY, TEST_BUCKET_ONLY } from '@/utils/env';
import { Injectable } from '@nestjs/common';
import type {
  CORSRule,
  GetBucketCorsParams,
  GetBucketCorsResult,
  GetObjectUrlParams,
  GetServiceParams,
} from 'cos-nodejs-sdk-v5';
import COS from 'cos-nodejs-sdk-v5';
import { promisify } from 'util';

@Injectable()
export class TencentCloudCosService extends COS {
  async getService(params: GetServiceParams = {}) {
    const result = await super.getService(params);
    if (is_TEST_BUCKET_ONLY) {
      result.Buckets = result.Buckets.filter((bucket) =>
        bucket.Name.startsWith(`${TEST_BUCKET_ONLY}-`),
      );
    }
    return result;
  }

  async getSignedObjectUrl(params: GetObjectUrlParams) {
    const { Url: original } = await promisify(super.getObjectUrl.bind(this))({
      ...params,
      Sign: true,
      Expires: 60 * 60 * 24 * 31, // 31day
    });
    const { Url: webp } = await promisify(super.getObjectUrl.bind(this))({
      ...params,
      Sign: true,
      Key: `${params.Key}${AssetStyles.webp}`,
      Expires: 60 * 60 * 24 * 31, // 31day
    });
    const { Url: thumbnail_300_ } = await promisify(super.getObjectUrl.bind(this))({
      ...params,
      Sign: true,
      Key: `${params.Key}${AssetStyles.thumbnail_300_}`,
      Expires: 60 * 60 * 24 * 31, // 31day
    });
    const { Url: thumbnail_700_ } = await promisify(super.getObjectUrl.bind(this))({
      ...params,
      Sign: true,
      Key: `${params.Key}${AssetStyles.thumbnail_700_}`,
      Expires: 60 * 60 * 24 * 31, // 31day
    });
    const { Url: thumbnail_blur_ } = await promisify(super.getObjectUrl.bind(this))({
      ...params,
      Sign: true,
      Key: `${params.Key}${AssetStyles.thumbnail_blur_}`,
      Expires: 60 * 60 * 24 * 31, // 31day
    });
    return {
      original,
      webp,
      thumbnail_300_,
      thumbnail_700_,
      thumbnail_blur_,
    };
  }

  getBucketCors(params: GetBucketCorsParams) {
    return promisify<GetBucketCorsParams, GetBucketCorsResult & { CORSRules: CORSRule[] }>(
      super.getBucketCors.bind(this),
    )(params);
  }
}
