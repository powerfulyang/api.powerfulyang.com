import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bucket } from '@/entity/bucket.entity';
import { Asset } from '@/entity/asset.entity';

@Injectable()
export class AssetService {
    constructor(
        @InjectRepository(Bucket)
        private bucketDao: Repository<Bucket>,
        @InjectRepository(Asset)
        private assetDao: Repository<Asset>,
    ) {}

    listBucket() {
        return this.bucketDao.findAndCount();
    }

    listAssets() {
        return this.assetDao.findAndCount();
    }
}
