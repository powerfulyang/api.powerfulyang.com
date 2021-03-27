import { Injectable } from '@nestjs/common';
import { AssetService } from '@/modules/asset/asset.service';
import { TencentCloudCosService } from 'api/tencent-cloud-cos';
import { Interval } from '@nestjs/schedule';
import { AppLogger } from '@/common/logger/app.logger';
import { __prod__ } from '@powerfulyang/utils';

@Injectable()
export class CosObjectUrlScheduleService {
  constructor(
    private assetService: AssetService,
    private tencentCloudCosService: TencentCloudCosService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(CosObjectUrlScheduleService.name);
    this.refreshObjectUrl().then(() => {
      this.logger.info('每次重启的时候需要刷新一下 object url!');
    });
  }

  @Interval(60 * 60 * 24 * 999)
  async refreshObjectUrl() {
    if (!__prod__) {
      this.logger.debug('only run in prod mode!');
      return;
    }
    const assets = await this.assetService.assetDao.find({
      relations: ['bucket'],
    });
    for (const asset of assets) {
      const { Url } = await this.tencentCloudCosService.getObjectUrl({
        Bucket: asset.bucket.bucketName,
        Region: asset.bucket.bucketRegion,
        Key: `${asset.sha1}${asset.fileSuffix}`,
        Expires: 60 * 60 * 24, // 1day
      });
      const objectUrl = Url;
      this.logger.debug(`update ${asset.id} objectUrl ==> ${JSON.stringify(objectUrl)}`);
      await this.assetService.assetDao.update(asset.id, {
        objectUrl,
      });
    }
  }
}
