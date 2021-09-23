import { HttpStatus, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { TencentCloudCosService } from 'api/tencent-cloud-cos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { find } from 'ramda';
import { produce } from 'immer';
import type {
  BucketACLDetailResult,
  GetBucketCorsData,
  GetBucketRefererData,
} from 'cos-nodejs-sdk-v5';
import { AppLogger } from '@/common/logger/app.logger';
import { Bucket } from '@/modules/bucket/entities/bucket.entity';
import { AssetBucket } from '@/enum/AssetBucket';
import { Region, SUCCESS } from '@/constants/constants';
import { CoreService } from '@/core/core.service';
import { getEnumKeys } from '@/utils/getClassStaticProperties';

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

  async initBucket() {
    for (const bucket of getEnumKeys(AssetBucket)) {
      let res: any;
      try {
        res = await this.tencentCloudCosService.headBucket({
          Bucket: bucket,
          Region,
        });
      } catch (e: any) {
        this.logger.info(`headBucket error code is [${e.name}]`);
        res = e;
      }
      if (res.statusCode !== HttpStatus.OK) {
        try {
          await this.tencentCloudCosService.putBucket({
            Bucket: bucket,
            Region,
          });
        } catch (e) {
          this.logger.error('putBucket', e);
        }
      }
      const bucketEntity = await this.bucketDao.findOne({
        bucketName: bucket as AssetBucket,
        bucketRegion: Region,
      });
      if (!bucketEntity) {
        await this.bucketDao.insert({
          bucketName: bucket as AssetBucket,
          bucketRegion: Region,
        });
      }
    }
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
}
