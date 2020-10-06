import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { COS_UPLOAD_MSG_PATTERN } from '@/constants/constants';
import { Bucket } from '@/entity/bucket.entity';
import { Asset } from '@/entity/asset.entity';
import { CoreService } from '@/core/core.service';

@Injectable()
export class AssetService {
    constructor(
        @InjectRepository(Bucket)
        private bucketDao: Repository<Bucket>,
        @InjectRepository(Asset)
        private assetDao: Repository<Asset>,
        private coreService: CoreService,
    ) {}

    listBucket() {
        return this.bucketDao.findAndCount();
    }

    listAssets() {
        return this.assetDao.findAndCount();
    }

    sendMsg(msg: string) {
        return this.coreService.microserviceClient.emit(
            COS_UPLOAD_MSG_PATTERN,
            msg,
        );
    }
}
