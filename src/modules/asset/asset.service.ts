import { Injectable } from '@nestjs/common';
import { Asset } from '@/entity/asset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from '@/common/decorator/pagination.decorator';
import { hammingDistance } from '@powerfulyang/node-utils';
import { Memoize } from '@powerfulyang/utils';
import { UploadFile } from '@/type/UploadFile';
import { CoreService } from '@/core/core.service';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset) readonly assetDao: Repository<Asset>,
    private coreService: CoreService,
  ) {}

  list(pagination: Pagination) {
    return this.assetDao.findAndCount({
      ...pagination,
      order: { id: 'DESC' },
    });
  }

  all() {
    return this.assetDao.find();
  }

  @Memoize()
  async pHashMap() {
    const assets = await this.assetDao.find();
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
    for (const file of files) {
      await this.coreService.initManualUpload(file.buffer);
    }
    return 'success';
  }
}
