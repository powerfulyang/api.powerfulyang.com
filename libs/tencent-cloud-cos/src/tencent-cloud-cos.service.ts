import { Injectable } from '@nestjs/common';
import type {
  CORSRule,
  GetBucketCorsParams,
  GetBucketCorsResult,
  GetObjectUrlParams,
} from 'cos-nodejs-sdk-v5';
import COS from 'cos-nodejs-sdk-v5';
import { promisify } from 'util';

@Injectable()
export class TencentCloudCosService extends COS {
  asyncGetObjectUrl(params: GetObjectUrlParams) {
    return promisify(super.getObjectUrl.bind(this))(params);
  }

  asyncGetBucketCors(params: GetBucketCorsParams) {
    return promisify<GetBucketCorsParams, GetBucketCorsResult & { CORSRules: CORSRule[] }>(
      super.getBucketCors.bind(this),
    )(params);
  }
}
