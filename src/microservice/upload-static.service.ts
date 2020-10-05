import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bucket } from '@/entity/bucket.entity';
import { Asset } from '@/entity/asset.entity';

@Injectable()
export class UploadStaticService {
    constructor(
        @InjectRepository(Asset)
        private assetDao: Repository<Asset>,
    ) {}

    async persistent(sha1: string) {
        return sha1;
    }

    async putCosObject(bucket: Bucket, buffer: Buffer, path: string) {
        await this.assetDao.clear();
        return { bucket, buffer, path };
    }
}
