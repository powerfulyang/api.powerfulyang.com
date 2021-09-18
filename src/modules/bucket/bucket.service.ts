import { HttpStatus, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { TencentCloudCosService } from 'api/tencent-cloud-cos';
import { Bucket } from '@/modules/bucket/entities/bucket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppLogger } from '@/common/logger/app.logger';
import { find } from 'ramda';
import { produce } from 'immer';
import { BucketACLDetailResult, GetBucketCorsData, GetBucketRefererData } from 'cos-nodejs-sdk-v5';
import { AssetBucket } from '@/enum/AssetBucket';
import { SUCCESS } from '@/constants/constants';
import { CoreService } from '@/core/core.service';

@Injectable()
export class BucketService {
  constructor(
    private readonly tencentCloudCosService: TencentCloudCosService,
    @InjectRepository(Bucket)
    private readonly bucketDao: Repository<Bucket>,
    private readonly logger: AppLogger,
    private coreService: CoreService,
  ) {
    this.logger.setContext(BucketService.name);
  }

  private async fetchAllBuckets() {
    const buckets = await this.tencentCloudCosService.listBuckets();
    const list = buckets.Buckets.map((bucket) => ({
      bucketName: bucket.Name.replace(/(-\d{10})$/, '') as AssetBucket,
      bucketRegion: bucket.Location,
      createAt: bucket.CreationDate,
    }));
    const listBucketAclPromises = list.map((bucket) => {
      return this.tencentCloudCosService.getBucketAcl({
        Bucket: bucket.bucketName,
        Region: bucket.bucketRegion,
      });
    });
    const listBucketAcl: BucketACLDetailResult[] = await Promise.all(listBucketAclPromises);
    const listBucketCorsPromises = list.map((bucket) => {
      return this.tencentCloudCosService.getBucketCors({
        Bucket: bucket.bucketName,
        Region: bucket.bucketRegion,
      });
    });
    const listBucketCors: GetBucketCorsData[] = await Promise.all(listBucketCorsPromises);
    const listBucketRefererPromises = list.map((bucket) => {
      return this.tencentCloudCosService.getBucketReferer({
        Bucket: bucket.bucketName,
        Region: bucket.bucketRegion,
      });
    });
    const listBucketReferer: GetBucketRefererData[] = await Promise.all(listBucketRefererPromises);
    const arr = list.map((bucket, index) => ({
      ...bucket,
      acl: listBucketAcl[index].ACL,
      cors: listBucketCors[index].CORSRules,
      referer: produce(listBucketReferer[index].RefererConfiguration, (draft) => {
        draft.DomainList &&
          (draft.DomainList.Domains = draft.DomainList.Domains.map((domain) =>
            Object.values(domain).join(''),
          ));
      }),
    }));
    this.logger.debug(arr);
    const bs: Bucket[] = await this.bucketDao.find();
    for (const b of arr) {
      const { bucketName, bucketRegion } = b;
      const bucket = find(
        (a) => a.bucketName === bucketName && a.bucketRegion === bucketRegion,
        bs,
      );
      if (!bucket) {
        await this.bucketDao.insert({ bucketName, bucketRegion });
      }
    }
    return arr;
  }

  list() {
    return this.fetchAllBuckets();
  }

  async createBucket(bucket: Bucket) {
    const res = await this.tencentCloudCosService.putBucket({
      Region: bucket.bucketRegion,
      Bucket: bucket.bucketName,
    });
    if (res.statusCode === HttpStatus.OK) {
      await this.bucketDao.insert(bucket);
    } else {
      throw new ServiceUnavailableException('创建bucket失败');
    }
    return SUCCESS;
  }

  getPublicBuckets() {
    return this.bucketDao.find({
      public: true,
    });
  }
}
