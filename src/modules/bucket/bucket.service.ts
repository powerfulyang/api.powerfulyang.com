import { HttpStatus, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNull } from '@powerfulyang/utils';
import { LoggerService } from '@/common/logger/logger.service';
import { CosBucket } from '@/modules/bucket/entities/bucket.entity';
import { TencentCloudAccountService } from '@/modules/tencent-cloud-account/tencent-cloud-account.service';
import type { CreateBucketDto } from '@/modules/bucket/dto/create-bucket.dto';

@Injectable()
export class BucketService {
  constructor(
    @InjectRepository(CosBucket)
    private readonly bucketDao: Repository<CosBucket>,
    private readonly logger: LoggerService,
    private readonly tencentCloudAccountService: TencentCloudAccountService,
  ) {
    this.logger.setContext(BucketService.name);
  }

  all() {
    return this.bucketDao.find();
  }

  async createNewBucket(bucket: CreateBucketDto) {
    const { Region, name } = bucket;

    const {
      ACL = 'public-read',
      CORSRules = [
        {
          AllowedOrigin: ['https://powerfulyang.com', 'https://*.powerfulyang.com'],
          AllowedMethod: ['GET'],
          MaxAgeSeconds: 3650000,
        },
      ],
      RefererConfiguration = {
        Status: 'Enabled',
        RefererType: 'White-List',
        DomainList: {
          Domains: ['powerfulyang.com', '*.powerfulyang.com'],
        },
      },
    } = bucket;
    const { tencentCloudAccount } = bucket;
    const AppId = await this.tencentCloudAccountService.getAppIdByAccountId(tencentCloudAccount.id);
    const util = await this.tencentCloudAccountService.getCosUtilByAccountId(
      tencentCloudAccount.id,
    );
    const Bucket = `${name}-${AppId}`;
    let res = await util.headBucket({
      Region,
      Bucket,
    });
    // 存在就查数据库
    if (res.statusCode === HttpStatus.OK) {
      // 同步 bucket
      return this.syncFromCloud(tencentCloudAccount, {
        Bucket,
        Region,
      });
    }
    // 不存在则创建哦
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
        throw new ServiceUnavailableException('create bucket failed');
      }
    }
    return res;
  }

  getBucketByBucketName(name: string) {
    return this.bucketDao.findOneOrFail({
      where: {
        name,
      },
      relations: ['tencentCloudAccount'],
    });
  }

  findBucketByName(name: string) {
    return this.bucketDao.findOneBy({ name });
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
    return Promise.all(
      accounts.map((account) => {
        return this.syncFromCloud(account);
      }),
    );
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

  private syncFromCloud(account: CosBucket['tencentCloudAccount']): Promise<CosBucket[]>;

  private syncFromCloud(
    account: CosBucket['tencentCloudAccount'],
    param: Pick<CosBucket, 'Bucket' | 'Region'>,
  ): Promise<CosBucket>;

  private async syncFromCloud(
    account: CosBucket['tencentCloudAccount'],
    param?: Pick<CosBucket, 'Bucket' | 'Region'>,
  ) {
    const util = await this.tencentCloudAccountService.getCosUtilByAccountId(account.id);
    const buckets = await util.getService(param);
    const list: Pick<CosBucket, 'Bucket' | 'Region'>[] = buckets.Buckets.filter((x) => {
      return param ? x.Name === param?.Bucket && x.Location === param?.Region : true;
    }).map((bucket) => ({
      Bucket: bucket.Name,
      Region: bucket.Location,
      createdAt: new Date(bucket.CreationDate),
    }));

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
      if (isNull(bucket)) {
        const name = b.Bucket.replace(/-\d+/, '');
        await this.bucketDao.insert({ ...b, name, tencentCloudAccount: account });
      } else {
        await this.bucketDao.update(bucket.id, b);
      }
    }
    if (param) {
      return arr[0];
    }
    return arr;
  }
}
