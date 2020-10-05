import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import {
    COS_UPLOAD_MSG_PATTERN,
    MICROSERVICE_NAME,
} from '@/constants/constants';
import { Bucket } from '@/entity/bucket.entity';
import { Asset } from '@/entity/asset.entity';

@Injectable()
export class StaticService {
    constructor(
        @InjectRepository(Bucket)
        private bucketDao: Repository<Bucket>,
        @InjectRepository(Asset)
        private assetDao: Repository<Asset>,
        @Inject(MICROSERVICE_NAME)
        private readonly microserviceClient: ClientProxy,
    ) {}

    listBucket() {
        return this.bucketDao.findAndCount();
    }

    listAssets() {
        return this.assetDao.findAndCount();
    }

    sendMsg(msg: string) {
        return this.microserviceClient.emit(
            COS_UPLOAD_MSG_PATTERN,
            msg,
        );
    }
}
