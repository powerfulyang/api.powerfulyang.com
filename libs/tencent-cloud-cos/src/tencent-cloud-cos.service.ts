import { Injectable } from '@nestjs/common';
import type {
  BucketACLOptions,
  BucketContentsOptions,
  BucketListResult,
  BucketOptions,
  DeleteMultipleObjectOptions,
  DeleteObjectOptions,
  GetBucketCorsOptions,
  GetBucketRefererOptions,
  GetObjectUrlOptions,
  PutBucketCorsOptions,
  PutBucketRefererOptions,
  UploadBucketObjectOptions,
} from 'cos-nodejs-sdk-v5';
import COS from 'cos-nodejs-sdk-v5';
import { promisify } from 'util';
import type { BucketRegion } from 'api/tencent-cloud-cos/cos-nodejs-sdk-v5';

@Injectable()
export class TencentCloudCosService {
  private readonly cosUtil = new COS({
    SecretId: process.env.TENCENT_CLOUD_SECRET_ID,
    SecretKey: process.env.TENCENT_CLOUD_SECRET_KEY,
  });

  private sn = process.env.TENCENT_CLOUD_COS_SN;

  setSn(sn: string) {
    this.sn = sn;
  }

  listBuckets() {
    return promisify<BucketListResult>(this.cosUtil.getService).call(this.cosUtil);
  }

  headBucket(options: BucketOptions) {
    return promisify(this.cosUtil.headBucket).call(this.cosUtil, {
      ...options,
      Bucket: `${options.Bucket}${this.sn}`,
    });
  }

  putBucket(options: BucketOptions) {
    return promisify(this.cosUtil.putBucket).call(this.cosUtil, {
      ...options,
      Bucket: `${options.Bucket}${this.sn}`,
    });
  }

  deleteBucket(Bucket: string, Region: BucketRegion) {
    return promisify(this.cosUtil.deleteBucket).call(this.cosUtil, {
      Bucket: `${Bucket}${this.sn}`,
      Region,
    });
  }

  listObjects(options: BucketContentsOptions) {
    return promisify(this.cosUtil.getBucket).call(this.cosUtil, {
      ...options,
      Bucket: `${options.Bucket}${this.sn}`,
    });
  }

  putBucketAcl(options: BucketACLOptions) {
    return promisify(this.cosUtil.putBucketAcl).call(this.cosUtil, {
      ...options,
      Bucket: `${options.Bucket}${this.sn}`,
    });
  }

  putBucketCors(options: PutBucketCorsOptions) {
    return promisify(this.cosUtil.putBucketCors).call(this.cosUtil, {
      ...options,
      Bucket: `${options.Bucket}${this.sn}`,
    });
  }

  getBucketAcl(options: BucketOptions) {
    return promisify(this.cosUtil.getBucketAcl).call(this.cosUtil, {
      ...options,
      Bucket: `${options.Bucket}${this.sn}`,
    });
  }

  putObject(options: UploadBucketObjectOptions) {
    return promisify(this.cosUtil.putObject).call(this.cosUtil, {
      ...options,
      Bucket: `${options.Bucket}${this.sn}`,
    });
  }

  deleteObject(options: DeleteObjectOptions) {
    return promisify(this.cosUtil.deleteObject).call(this.cosUtil, {
      ...options,
      Bucket: `${options.Bucket}${this.sn}`,
    });
  }

  deleteMultipleObject(options: DeleteMultipleObjectOptions) {
    return promisify(this.cosUtil.deleteMultipleObject).call(this.cosUtil, {
      ...options,
      Bucket: `${options.Bucket}${this.sn}`,
    });
  }

  getObjectUrl(options: GetObjectUrlOptions) {
    return promisify(this.cosUtil.getObjectUrl).call(this.cosUtil, {
      ...options,
      Bucket: `${options.Bucket}${this.sn}`,
    });
  }

  putBucketReferer(options: PutBucketRefererOptions) {
    return promisify(this.cosUtil.putBucketReferer).call(this.cosUtil, {
      ...options,
      Bucket: `${options.Bucket}${this.sn}`,
    });
  }

  getBucketCors(options: GetBucketCorsOptions) {
    return promisify(this.cosUtil.getBucketCors).call(this.cosUtil, {
      ...options,
      Bucket: `${options.Bucket}${this.sn}`,
    });
  }

  getBucketReferer(options: GetBucketRefererOptions) {
    return promisify(this.cosUtil.getBucketReferer).call(this.cosUtil, {
      ...options,
      Bucket: `${options.Bucket}${this.sn}`,
    });
  }
}
