import { Injectable } from '@nestjs/common';
import { TencentCloudCosService } from 'api/tencent-cloud-cos';
import { Bucket } from '@/entity/bucket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppLogger } from '@/common/logger/app.logger';
import { find } from 'ramda';
import { produce } from 'immer';

@Injectable()
export class BucketService {
  constructor(
    private readonly tencentCloudCosService: TencentCloudCosService,
    @InjectRepository(Bucket)
    private readonly bucketDao: Repository<Bucket>,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(BucketService.name);
  }

  private async fetchAllBuckets() {
    const buckets = await this.tencentCloudCosService.listBuckets();
    const list = buckets.Buckets.map((bucket) => ({
      bucketName: bucket.Name.replace(/(-\d{10})$/, ''),
      bucketRegion: bucket.Location,
      createAt: bucket.CreationDate,
    }));
    const listBucketAclPromises = list.map((bucket) => {
      return this.tencentCloudCosService.getBucketAcl({
        Bucket: bucket.bucketName,
        Region: bucket.bucketRegion,
      });
    });
    const listBucketAcl = (await Promise.all(listBucketAclPromises)) as any;
    const listBucketCorsPromises = list.map((bucket) => {
      return this.tencentCloudCosService.getBucketCors({
        Bucket: bucket.bucketName,
        Region: bucket.bucketRegion,
      });
    });
    const listBucketCors = (await Promise.all(listBucketCorsPromises)) as any;
    const listBucketRefererPromises = list.map((bucket) => {
      return this.tencentCloudCosService.getBucketReferer({
        Bucket: bucket.bucketName,
        Region: bucket.bucketRegion,
      });
    });
    const listBucketReferer = (await Promise.all(listBucketRefererPromises)) as any;
    const arr = list.map((bucket, index) => ({
      ...bucket,
      acl: listBucketAcl[index].ACL,
      cors: listBucketCors[index].CORSRules,
      referer: produce(
        listBucketReferer[index].RefererConfiguration,
        (draft: { DomainList: { Domains: any[] } }) => {
          draft.DomainList.Domains = draft.DomainList.Domains.map((domain) =>
            Object.values(domain).join(''),
          );
        },
      ),
    }));
    this.logger.debug(arr);
    const bs: Bucket[] = await this.bucketDao.find();
    for (const b of arr) {
      const { bucketName, bucketRegion } = b;
      const bucket = find(
        (a) => a.bucketName === bucketName && a.bucketRegion === bucketRegion,
        bs,
      );
      if (bucket) {
        await this.bucketDao.update({ bucketName, bucketRegion }, b);
      } else {
        await this.bucketDao.insert(b);
      }
    }
    return this.bucketDao.find();
  }

  list() {
    return this.fetchAllBuckets();
  }
}
