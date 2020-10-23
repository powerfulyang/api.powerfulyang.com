import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from '@/entity/asset.entity';
import { AppLogger } from '@/common/logger/app.logger';
import { TencentCloudCosService } from 'api/tencent-cloud-cos';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadAssetService {
    constructor(
        @InjectRepository(Asset)
        private assetDao: Repository<Asset>,
        private logger: AppLogger,
        private tencentCloudCosService: TencentCloudCosService,
    ) {
        this.logger.setContext(UploadAssetService.name);
    }

    async persistent(data: {
        sha1: string;
        suffix: string;
        bucket: string;
    }) {
        const filename = `${data.sha1}${data.suffix}`;
        const buffer = readFileSync(
            join(process.cwd(), 'assets', filename),
        );
        const res = await this.tencentCloudCosService.putObject({
            Bucket: data.bucket,
            Region: 'ap-shanghai',
            Key: filename,
            Body: buffer,
        });
        await this.assetDao.update(
            { cosUrl: res.Location },
            { sha1: data.sha1 },
        );
    }
}
