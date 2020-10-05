import { Injectable } from '@nestjs/common';
import COS, {
    BucketACL,
    BucketListResult,
    BucketRegion,
} from 'cos-nodejs-sdk-v5';
import { promisify } from 'util';

@Injectable()
export class TencentCloudCosService {
    private readonly cosUtil = new COS({
        SecretId: process.env.TENCENT_CLOUD_SECRET_ID,
        SecretKey: process.env.TENCENT_CLOUD_SECRET_KEY,
        Protocol: 'https:',
    });

    listBuckets() {
        return promisify<BucketListResult>(
            this.cosUtil.getService,
        ).call(this.cosUtil);
    }

    putBucket(Bucket: string, Region: BucketRegion) {
        return promisify(this.cosUtil.putBucket).call(this.cosUtil, {
            Bucket,
            Region,
        });
    }

    listObjects(
        Bucket: string,
        Region: BucketRegion,
        Prefix?: string,
    ) {
        return promisify(this.cosUtil.getBucket).call(this.cosUtil, {
            Bucket,
            Region,
            Prefix,
        });
    }

    deleteBucket(Bucket: string, Region: BucketRegion) {
        return promisify(this.cosUtil.deleteBucket).call(
            this.cosUtil,
            { Bucket, Region },
        );
    }

    putBucketAcl(
        Bucket: string,
        Region: BucketRegion,
        ACL: BucketACL,
    ) {
        return promisify(this.cosUtil.putBucketAcl).call(
            this.cosUtil,
            { Bucket, Region, ACL },
        );
    }

    getBucketAcl(Bucket: string, Region: BucketRegion) {
        return promisify(this.cosUtil.getBucketAcl).call(
            this.cosUtil,
            { Bucket, Region },
        );
    }

    putObject(
        Bucket: string,
        Region: BucketRegion,
        Key: string,
        Body: ReadableStream | Buffer | string,
    ) {
        return promisify(this.cosUtil.putObject).call(this.cosUtil, {
            Bucket,
            Region,
            Key,
            Body,
        });
    }

    deleteObject(Bucket: string, Region: BucketRegion, Key: string) {
        return promisify(this.cosUtil.deleteObject).call(
            this.cosUtil,
            { Bucket, Region, Key },
        );
    }
}
