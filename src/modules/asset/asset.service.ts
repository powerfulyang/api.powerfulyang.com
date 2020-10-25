import { Injectable } from '@nestjs/common';
import { Asset } from '@/entity/asset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AssetService {
    constructor(
        @InjectRepository(Asset) private assetDao: Repository<Asset>,
    ) {}

    list() {
        return this.assetDao.findAndCount();
    }
}
