import { Injectable } from '@nestjs/common';
import type {
  DeleteBucketParams,
  DeleteBucketResult,
  DeleteMultipleObjectParams,
  DeleteMultipleObjectResult,
  DeleteObjectParams,
  DeleteObjectResult,
  GetBucketAclParams,
  GetBucketAclResult,
  GetBucketCorsParams,
  GetBucketCorsResult,
  GetBucketParams,
  GetBucketRefererParams,
  GetBucketRefererResult,
  GetBucketResult,
  GetObjectUrlParams,
  GetObjectUrlResult,
  GetServiceParams,
  GetServiceResult,
  HeadBucketParams,
  HeadBucketResult,
  PutBucketAclParams,
  PutBucketAclResult,
  PutBucketCorsParams,
  PutBucketCorsResult,
  PutBucketParams,
  PutBucketRefererParams,
  PutBucketRefererResult,
  PutBucketResult,
  PutObjectParams,
  PutObjectResult,
} from '@powerfulyang/cos-nodejs-sdk-v5';
import COS from '@powerfulyang/cos-nodejs-sdk-v5';
import { promisify } from 'util';
import type { CosBucket } from '@/modules/bucket/entities/bucket.entity';

export type CloudSecretOptions = {
  SecretId: string;
  SecretKey: string;
  AppId: string;
};

@Injectable()
export class TencentCloudCosService {
  private readonly cosUtil: COS;

  constructor(options: CloudSecretOptions) {
    this.cosUtil = new COS(options);
  }

  deleteObject(options: DeleteObjectParams) {
    return promisify<DeleteObjectParams, DeleteObjectResult>(this.cosUtil.deleteObject).call(
      this.cosUtil,
      options,
    );
  }

  headBucket(options: Pick<CosBucket, 'Region' | 'Bucket'>) {
    return promisify<HeadBucketParams, HeadBucketResult>(this.cosUtil.headBucket).call(
      this.cosUtil,
      options,
    );
  }

  putBucket(options: PutBucketParams) {
    return promisify<PutBucketParams, PutBucketResult>(this.cosUtil.putBucket).call(
      this.cosUtil,
      options,
    );
  }

  deleteBucket(options: DeleteBucketParams) {
    return promisify<DeleteBucketParams, DeleteBucketResult>(this.cosUtil.deleteBucket).call(
      this.cosUtil,
      options,
    );
  }

  getBucket(options: GetBucketParams) {
    return promisify<GetBucketParams, GetBucketResult>(this.cosUtil.getBucket).call(
      this.cosUtil,
      options,
    );
  }

  putBucketAcl(options: PutBucketAclParams) {
    return promisify<PutBucketAclParams, PutBucketAclResult>(this.cosUtil.putBucketAcl).call(
      this.cosUtil,
      options,
    );
  }

  putBucketCors(options: PutBucketCorsParams) {
    return promisify<PutBucketCorsParams, PutBucketCorsResult>(this.cosUtil.putBucketCors).call(
      this.cosUtil,
      options,
    );
  }

  getBucketAcl(options: GetBucketAclParams) {
    return promisify<GetBucketAclParams, GetBucketAclResult>(this.cosUtil.getBucketAcl).call(
      this.cosUtil,
      options,
    );
  }

  putObject(options: PutObjectParams) {
    return promisify<PutObjectParams, PutObjectResult>(this.cosUtil.putObject).call(
      this.cosUtil,
      options,
    );
  }

  deleteMultipleObject(options: DeleteMultipleObjectParams) {
    return promisify<DeleteMultipleObjectParams, DeleteMultipleObjectResult>(
      this.cosUtil.deleteMultipleObject,
    ).call(this.cosUtil, options);
  }

  getObjectUrl(options: GetObjectUrlParams) {
    return promisify<GetObjectUrlParams, GetObjectUrlResult>(this.cosUtil.getObjectUrl).call(
      this.cosUtil,
      options,
    );
  }

  putBucketReferer(options: PutBucketRefererParams) {
    return promisify<PutBucketRefererParams, PutBucketRefererResult>(
      this.cosUtil.putBucketReferer,
    ).call(this.cosUtil, options);
  }

  getBucketCors(options: GetBucketCorsParams) {
    return promisify<GetBucketCorsParams, GetBucketCorsResult>(this.cosUtil.getBucketCors).call(
      this.cosUtil,
      options,
    );
  }

  getBucketReferer(options: GetBucketRefererParams) {
    return promisify<GetBucketRefererParams, GetBucketRefererResult>(
      this.cosUtil.getBucketReferer,
    ).call(this.cosUtil, options);
  }

  getService(args: GetServiceParams = {}) {
    return promisify<GetServiceParams, GetServiceResult>(this.cosUtil.getService).call(
      this.cosUtil,
      args,
    );
  }
}
