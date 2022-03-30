import { HttpStatus, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { isDefined, isNotNull } from '@powerfulyang/utils';
import { AppLogger } from '@/common/logger/app.logger';
import { CosBucket } from '@/modules/bucket/entities/bucket.entity';
import {
  PRIMARY_ORIGIN,
  SERVER_HOST_DOMAIN,
  WILDCARD_HOST_DOMAIN,
  WILDCARD_ORIGIN,
} from '@/constants/constants';
import { TencentCloudAccountService } from '@/modules/tencent-cloud-account/tencent-cloud-account.service';
import type { CreateBucketDto } from '@/modules/bucket/entities/create-bucket.dto';

@Injectable()
export class BucketService {
  constructor(
    @InjectRepository(CosBucket)
    private readonly bucketDao: Repository<CosBucket>,
    private readonly logger: AppLogger,
    private readonly tencentCloudAccountService: TencentCloudAccountService,
  ) {
    this.logger.setContext(BucketService.name);
  }

  all() {
    return this.bucketDao.find();
  }

  async createNewBucket(bucket: CreateBucketDto) {
    const { Bucket, Region } = bucket;
    const {
      ACL = 'public-read',
      CORSRules = [
        {
          AllowedOrigin: [PRIMARY_ORIGIN, WILDCARD_ORIGIN],
          AllowedMethod: ['GET'],
          MaxAgeSeconds: 3650000,
        },
      ],
      RefererConfiguration = {
        Status: 'Enabled',
        RefererType: 'White-List',
        DomainList: {
          Domains: [SERVER_HOST_DOMAIN, WILDCARD_HOST_DOMAIN],
        },
      },
    } = bucket;
    const { tencentCloudAccount } = bucket;
    const util = await this.tencentCloudAccountService.getCosUtilByAccountId(
      tencentCloudAccount.id,
    );
    let res = await util.headBucket({
      Region,
      Bucket,
    });
    // 不存在则创建哦 存在就不管了
    if (res.statusCode !== HttpStatus.OK) {
      res = await util.putBucket({
        Region,
        Bucket,
      });
      // 创建之后 bucket 默认都是 public-read 的
      if (res.statusCode !== HttpStatus.OK) {
        res = await util.putBucketAcl({
          ACL,
          Bucket,
          Region,
        });
      }
      // 修改 ACL 之后还要修改 CORS 设置
      if (res.statusCode !== HttpStatus.OK) {
        res = await util.putBucketCors({
          CORSRules,
          Bucket,
          Region,
        });
      }
      // 再修改 Referer
      if (res.statusCode !== HttpStatus.OK) {
        res = await util.putBucketReferer({
          RefererConfiguration,
          Bucket,
          Region,
        });
      }
      // 上面的都完成啦
      if (res.statusCode !== HttpStatus.OK) {
        throw new ServiceUnavailableException('创建bucket失败');
      }
    }
  }

  getBucketByBucketName(name: string) {
    return this.bucketDao.findOneByOrFail({ name });
  }

  /**
   *
   * 初始化逻辑修改
   * @Date 2021-09-29
   * @author powerfulyang
   * 先从 cos 拉取已经创建的
   * 再判断 Built-in AssetBucket Enum
   *
   */
  async initBucket() {
    const accounts = await this.tencentCloudAccountService.findAll();
    const result = [];
    for (const account of accounts) {
      const res = await this.syncFromCloud(account);
      result.push(...res);
    }
    return result;
  }

  async syncFromCloud(
    account: CosBucket['tencentCloudAccount'],
    param?: Pick<CosBucket, 'Bucket' | 'Region'>,
  ) {
    const util = await this.tencentCloudAccountService.getCosUtilByAccountId(account.id);
    let list: Pick<CosBucket, 'Bucket' | 'Region'>[] = [];
    if (isDefined(param)) {
      const res = await util.headBucket(param);
      if (res.statusCode === HttpStatus.OK) {
        list = [{ Bucket: param.Bucket, Region: param.Region }];
      }
    } else {
      const buckets = await util.getService(param);
      list = buckets.Buckets.map((bucket) => ({
        Bucket: bucket.Name,
        Region: bucket.Location,
        createAt: new Date(bucket.CreationDate),
      }));
    }

    const listBucketAclPromises = list.map((bucket) =>
      util.getBucketAcl({
        Bucket: bucket.Bucket,
        Region: bucket.Region,
      }),
    );
    const listBucketAcl = await Promise.all(listBucketAclPromises);
    const listBucketCorsPromises = list.map((bucket) =>
      util.getBucketCors({
        Bucket: bucket.Bucket,
        Region: bucket.Region,
      }),
    );
    const listBucketCors = await Promise.all(listBucketCorsPromises);
    const listBucketRefererPromises = list.map((bucket) =>
      util.getBucketReferer({
        Bucket: bucket.Bucket,
        Region: bucket.Region,
      }),
    );
    const listBucketReferer = await Promise.all(listBucketRefererPromises);
    const arr = list.map((bucket, index) => ({
      ...bucket,
      ACL: listBucketAcl[index].ACL,
      CORSRules: listBucketCors[index].CORSRules,
      RefererConfiguration: listBucketReferer[index].RefererConfiguration,
    }));
    for (const b of arr) {
      const { Bucket, Region } = b;
      const bucket = await this.bucketDao.findOneBy({
        Bucket,
        Region,
      });
      if (isNotNull(bucket)) {
        const name = b.Bucket.replace(/-\d+/, '');
        await this.bucketDao.insert({ ...b, name, tencentCloudAccount: account });
      } else {
        await this.bucketDao.update(
          {
            Bucket,
            Region,
          },
          b,
        );
      }
    }
    return this.bucketDao.find({
      where: {
        tencentCloudAccount: Equal(account),
      },
    });
  }

  async listPublicBucket(): Promise<CosBucket[]>;
  async listPublicBucket(onlyPrimaryKeyArray: true): Promise<CosBucket['id'][]>;

  /**
   * 列出所有的公开 bucket
   * @param onlyPrimaryKeyArray
   */
  async listPublicBucket(onlyPrimaryKeyArray?: boolean) {
    const buckets = await this.bucketDao.find({
      where: {
        public: true,
      },
    });
    if (onlyPrimaryKeyArray) {
      return buckets.map((b) => b.id);
    }
    return buckets;
  }
}
