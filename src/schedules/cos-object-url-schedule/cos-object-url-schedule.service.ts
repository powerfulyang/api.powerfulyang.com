import { Injectable } from '@nestjs/common';
import { AssetService } from '@/modules/asset/asset.service';
import { TencentCloudCosService } from 'api/tencent-cloud-cos';
import { Interval } from '@nestjs/schedule';
import { AppLogger } from '@/common/logger/app.logger';
import { CoreService } from '@/core/core.service';

@Injectable()
export class CosObjectUrlScheduleService {
  constructor(
    private assetService: AssetService,
    private tencentCloudCosService: TencentCloudCosService,
    private readonly logger: AppLogger,
    private readonly coreService: CoreService,
  ) {
    this.logger.setContext(CosObjectUrlScheduleService.name);
  }

  @Interval(60 * 60 * 24 * 999)
  async refreshObjectUrl() {
    const bool = await this.coreService.isProdCommonNode();
    if (!bool) {
      return;
    }
    this.logger.info('this is common node!!!');
    const assets = await this.assetService.all();
    for (const asset of assets) {
      const { Url } = await this.tencentCloudCosService.getObjectUrl({
        Bucket: asset.bucket.bucketName,
        Region: asset.bucket.bucketRegion,
        Key: `${asset.sha1}${asset.fileSuffix}`,
        Expires: 60 * 60 * 24, // 1day
      });
      const objectUrl = Url;
      this.logger.debug(`update ${asset.id} objectUrl ==> ${JSON.stringify(objectUrl)}`);
      await this.assetService.update(asset.id, {
        objectUrl,
      });
    }
  }
}
