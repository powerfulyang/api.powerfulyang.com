import { Injectable } from '@nestjs/common';
import { Asset } from '@/entity/asset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from '@/common/decorator/pagination.decorator';

@Injectable()
export class AssetService {
    constructor(
        @InjectRepository(Asset) readonly assetDao: Repository<Asset>,
    ) {}

    list(pagination: Pagination) {
        return this.assetDao.findAndCount(pagination);
    }
}
