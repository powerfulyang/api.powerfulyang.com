import { Injectable, Scope } from '@nestjs/common';
import COS, {
    BucketACL,
    BucketContentsOptions,
    BucketListResult,
    BucketOptions,
    BucketRegion,
} from 'cos-nodejs-sdk-v5';
import { promisify } from 'util';

@Injectable({ scope: Scope.TRANSIENT })
export class TencentCloudCosService {
    private readonly cosUtil = new COS({
        SecretId: process.env.TENCENT_CLOUD_SECRET_ID,
        SecretKey: process.env.TENCENT_CLOUD_SECRET_KEY,
    });

    private sn = '-1253520329';

    setSn(sn: string) {
        this.sn = sn;
    }

    listBuckets() {
        return promisify<BucketListResult>(
            this.cosUtil.getService,
        ).call(this.cosUtil);
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
        return promisify(this.cosUtil.deleteBucket).call(
            this.cosUtil,
            { Bucket: `${Bucket}${this.sn}`, Region },
        );
    }

    listObjects(options: BucketContentsOptions) {
        return promisify(this.cosUtil.getBucket).call(this.cosUtil, {
            ...options,
            Bucket: `${options.Bucket}${this.sn}`,
        });
    }

    putBucketAcl(
        Bucket: string,
        Region: BucketRegion,
        ACL: BucketACL,
    ) {
        return promisify(this.cosUtil.putBucketAcl).call(
            this.cosUtil,
            { Bucket: `${Bucket}${this.sn}`, Region, ACL },
        );
    }

    getBucketAcl(Bucket: string, Region: BucketRegion) {
        return promisify(this.cosUtil.getBucketAcl).call(
            this.cosUtil,
            { Bucket: `${Bucket}${this.sn}`, Region },
        );
    }

    putObject(
        Bucket: string,
        Region: BucketRegion,
        Key: string,
        Body: ReadableStream | Buffer | string,
    ) {
        return promisify(this.cosUtil.putObject).call(this.cosUtil, {
            Bucket: `${Bucket}${this.sn}`,
            Region,
            Key,
            Body,
        });
    }

    deleteObject(Bucket: string, Region: BucketRegion, Key: string) {
        return promisify(this.cosUtil.deleteObject).call(
            this.cosUtil,
            { Bucket: `${Bucket}${this.sn}`, Region, Key },
        );
    }
}
