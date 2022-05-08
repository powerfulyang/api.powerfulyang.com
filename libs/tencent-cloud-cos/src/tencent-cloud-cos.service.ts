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
import { is_TEST_BUCKET_ONLY, TEST_BUCKET_ONLY } from '@/utils/env';

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

  // @ts-ignore
  async getObjectUrl(params: GetObjectUrlParams) {
    return promisify(super.getObjectUrl.bind(this))(params);
  }

  getBucketCors(params: GetBucketCorsParams) {
    return promisify<GetBucketCorsParams, GetBucketCorsResult & { CORSRules: CORSRule[] }>(
      super.getBucketCors.bind(this),
    )(params);
  }
}
