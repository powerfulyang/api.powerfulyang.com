import { Injectable } from '@nestjs/common';
import { AssetService } from '@/modules/asset/asset.service';
import { TencentCloudCosService } from 'api/tencent-cloud-cos';
import { Interval, Timeout } from '@nestjs/schedule';
import { AppLogger } from '@/common/logger/app.logger';
import { COMMON_CODE_UUID } from '@/utils/uuid';
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
    const uuid = await this.coreService.getCommonNodeUuid();
    if (uuid !== COMMON_CODE_UUID) {
      return;
    }
    this.logger.info('this is common node!!!');
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

  @Timeout(10000) // 10秒之后运行
  refresh() {
    this.refreshObjectUrl().then(() => {
      this.logger.info('每次重启的时候需要刷新一下 object url!');
    });
  }
}
