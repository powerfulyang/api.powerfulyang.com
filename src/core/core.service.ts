import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { __prod__ } from '@powerfulyang/utils';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TencentCloudCosService } from 'api/tencent-cloud-cos';
import { Bucket } from '@/modules/bucket/entities/bucket.entity';
import { CacheService } from '@/core/cache/cache.service';
import { COMMON_CODE_UUID } from '@/utils/uuid';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';
import { AppLogger } from '@/common/logger/app.logger';
import { Asset } from '@/modules/asset/entities/asset.entity';
import type { AssetBucket } from '@/enum/AssetBucket';
import { COS_UPLOAD_MSG_PATTERN, MICROSERVICE_NAME, Region } from '@/constants/constants';

@Injectable()
export class CoreService {
  constructor(
    @Inject(MICROSERVICE_NAME)
    readonly microserviceClient: ClientProxy,
    private logger: AppLogger,
    @InjectRepository(Asset)
    private assetDao: Repository<Asset>,
    @InjectRepository(Bucket)
    private bucketDao: Repository<Bucket>,
    private tencentCloudCosService: TencentCloudCosService,
    private cacheService: CacheService,
  ) {
    this.logger.setContext(CoreService.name);
    this.setCommonNodeUuid().then((uuid) => {
      this.logger.info(`node uuid => ${uuid}`);
    });
  }

  async setCommonNodeUuid() {
    this.logger.info(`当前环境====>${process.env.NODE_ENV}`);
    await this.cacheService.set(REDIS_KEYS.COMMON_NODE, COMMON_CODE_UUID);
    return COMMON_CODE_UUID;
  }

  getCommonNodeUuid() {
    return this.cacheService.get(REDIS_KEYS.COMMON_NODE);
  }

  async isCommonNode() {
    const uuid = await this.getCommonNodeUuid();
    return uuid === COMMON_CODE_UUID;
  }

  async isProdCommonNode() {
    const bool = await this.isCommonNode();
    return bool && __prod__;
  }

  notifyCos(notification: { sha1: string; suffix: string; bucketName: AssetBucket }) {
    return this.microserviceClient.emit(COS_UPLOAD_MSG_PATTERN, notification);
  }

  getBotBucket(bucketName: AssetBucket) {
    return this.bucketDao.findOneOrFail({
      bucketName,
      bucketRegion: Region,
    });
  }
}
