import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AppLogger } from '@/common/logger/app.logger';
import { Asset } from '@/modules/asset/entities/asset.entity';
import type { UploadFileMsg } from '@/type/UploadFile';
import { BucketService } from '@/modules/bucket/bucket.service';
import { TencentCloudAccountService } from '@/modules/tencent-cloud-account/tencent-cloud-account.service';

@Injectable()
export class UploadAssetService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetDao: Repository<Asset>,
    private readonly logger: AppLogger,
    private readonly bucketService: BucketService,
    private readonly tencentCloudAccountService: TencentCloudAccountService,
  ) {
    this.logger.setContext(UploadAssetService.name);
  }

  async persistent(data: UploadFileMsg) {
    const Key = `${data.sha1}.${data.suffix}`;

    const { name } = data;
    const bucket = await this.bucketService.getBucketByName(name);
    const { Bucket, Region } = bucket;
    const { tencentCloudAccount } = bucket;
    const util = await this.tencentCloudAccountService.getCosUtilByAccountId(
      tencentCloudAccount.id,
    );
    const buffer = readFileSync(join(process.cwd(), 'assets', Key));
    const res = await util.putObject({
      Bucket,
      Region,
      Key,
      Body: buffer,
    });
    const { Url: objectUrl } = await util.getObjectUrl({
      Bucket,
      Region,
      Key,
      Expires: 60 * 60 * 24, // 1day
    });
    await this.assetDao.update(
      { sha1: data.sha1 },
      { cosUrl: `https://${res.Location}`, objectUrl },
    );
  }
}
