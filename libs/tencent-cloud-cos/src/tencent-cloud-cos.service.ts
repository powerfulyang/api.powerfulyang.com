import { Injectable, Scope } from '@nestjs/common';
import COS, {
    BucketACLOptions,
    BucketContentsOptions,
    BucketListResult,
    BucketOptions,
    BucketRegion,
    DeleteObjectOptions,
    UploadBucketObjectOptions,
} from 'cos-nodejs-sdk-v5';
import { promisify } from 'util';

@Injectable({ scope: Scope.TRANSIENT })
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

    putBucketAcl(options: BucketACLOptions) {
        return promisify(this.cosUtil.putBucketAcl).call(
            this.cosUtil,
            { ...options, Bucket: `${options.Bucket}${this.sn}` },
        );
    }

    getBucketAcl(options: BucketOptions) {
        return promisify(this.cosUtil.getBucketAcl).call(
            this.cosUtil,
            { ...options, Bucket: `${options.Bucket}${this.sn}` },
        );
    }

    putObject(options: UploadBucketObjectOptions) {
        return promisify(this.cosUtil.putObject).call(this.cosUtil, {
            ...options,
            Bucket: `${options.Bucket}${this.sn}`,
        });
    }

    deleteObject(options: DeleteObjectOptions) {
        return promisify(this.cosUtil.deleteObject).call(
            this.cosUtil,
            { ...options, Bucket: `${options.Bucket}${this.sn}` },
        );
    }
}
