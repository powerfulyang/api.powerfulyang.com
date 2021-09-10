import { HttpStatus, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Asset } from '@/entity/asset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Transaction, TransactionRepository } from 'typeorm';
import { Pagination } from '@/common/decorator/pagination.decorator';
import { hammingDistance } from '@powerfulyang/node-utils';
import { UploadFile } from '@/type/UploadFile';
import { CoreService } from '@/core/core.service';
import { SUCCESS } from '@/constants/constants';
import { TencentCloudCosService } from 'api/tencent-cloud-cos';
import { Bucket } from '@/entity/bucket.entity';
import { pluck } from 'ramda';
import { AssetBucket } from '@/enum/AssetBucket';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset) private readonly assetDao: Repository<Asset>,
    @InjectRepository(Bucket) private readonly bucketDao: Repository<Bucket>,
    private coreService: CoreService,
    private tencentCloudCosService: TencentCloudCosService,
  ) {}

  async publicList(pagination: Pagination) {
    const buckets = await this.bucketDao.find({
      where: {
        public: true,
      },
    });
    return this.assetDao.findAndCount({
      ...pagination,
      order: { id: 'DESC' },
      where: {
        bucket: In(pluck('id', buckets)),
      },
    });
  }

  async list(pagination: Pagination) {
    return this.assetDao.findAndCount({
      ...pagination,
      order: { id: 'DESC' },
    });
  }

  all() {
    return this.assetDao.find({
      relations: ['bucket'],
    });
  }

  async pHashMap() {
    const assets = await this.assetDao.find({
      select: ['id', 'pHash'],
    });
    const distanceMap = new Map();
    for (;;) {
      const next = assets.pop();
      if (next) {
        assets.forEach((asset) => {
          const distance = hammingDistance(asset.pHash, next.pHash);
          if (distance <= 10) {
            const arr = distanceMap.get(asset.id) || [];
            if (arr[distance]) {
              arr[distance].push(next.id);
            } else {
              arr[distance] = [next.id];
            }
            distanceMap.set(asset.id, arr);
            const arr2 = distanceMap.get(next.id) || [];
            if (arr2[distance]) {
              arr2[distance].push(asset.id);
            } else {
              arr2[distance] = [asset.id];
            }
            distanceMap.set(asset.id, arr);
            distanceMap.set(next.id, arr2);
          }
        });
      } else {
        break;
      }
    }
    const obj = {} as any;
    distanceMap.forEach((val, key) => {
      obj[key] = val;
    });
    return obj;
  }

  async saveAsset(files: UploadFile[]) {
    const assets: Asset[] = [];
    for (const file of files) {
      const asset = await this.coreService.initManualUpload(file.buffer);
      assets.push(asset);
    }
    return assets;
  }

  async saveAssetToBucket(files: UploadFile[], bucketName: AssetBucket) {
    const assets: Asset[] = [];
    for (const file of files) {
      const asset = await this.coreService.initManualUpload(file.buffer, false, bucketName);
      assets.push(asset);
    }
    return assets;
  }

  /**
   * 批量删除 asset
   * @param ids
   * @param assetRepository
   */
  @Transaction()
  async deleteAsset(
    ids: number[],
    @TransactionRepository(Asset) assetRepository?: Repository<Asset>,
  ) {
    for (const id of ids) {
      const asset = await assetRepository!.findOneOrFail(id, {
        relations: ['bucket'],
      });
      const res = await this.tencentCloudCosService.deleteObject({
        Key: `${asset.sha1}${asset.fileSuffix}`,
        Bucket: asset.bucket.bucketName,
        Region: asset.bucket.bucketRegion,
      });
      await assetRepository!.delete(id);
      if (res.statusCode !== HttpStatus.NO_CONTENT) {
        throw new ServiceUnavailableException(`删除cos源文件失败, 数据库回滚`);
      }
    }
    return SUCCESS;
  }

  async randomAsset() {
    return this.assetDao.createQueryBuilder().orderBy('RAND()').limit(1).getOneOrFail();
  }

  update(id: Asset['id'], asset: Partial<Asset>) {
    return this.assetDao.update(id, asset);
  }

  findById(id: Asset['id']) {
    return this.assetDao.findOneOrFail(id);
  }

  async syncFromCos() {
    const all = await this.assetDao.find();
    for (const asset of all) {
      const path = join(process.cwd(), 'assets', asset.sha1 + asset.fileSuffix);
      const exist = existsSync(path);
      if (!exist) {
        // 需要下载下来
        const res = await fetch(asset.objectUrl);
        const buffer = await res.buffer();
        writeFileSync(path, buffer);
      }
    }
    return SUCCESS;
  }
}
