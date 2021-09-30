import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { AssetService } from '@/modules/asset/asset.service';
import { AppLogger } from '@/common/logger/app.logger';
import { CoreService } from '@/core/core.service';
import { TencentCloudAccountService } from '@/modules/tencent-cloud-account/tencent-cloud-account.service';

@Injectable()
export class CosObjectUrlScheduleService {
  constructor(
    private readonly assetService: AssetService,
    private readonly logger: AppLogger,
    private readonly coreService: CoreService,
    private readonly tencentCloudAccountService: TencentCloudAccountService,
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
      const util = await this.tencentCloudAccountService.getCosUtilByAccountId(
        asset.bucket.tencentCloudAccount.id,
      );
      const { Url } = await util.getObjectUrl({
        Bucket: asset.bucket.Bucket,
        Region: asset.bucket.Region,
        Key: `${asset.sha1}.${asset.fileSuffix}`,
        Expires: 60 * 60 * 24, // 1day
      });
      const objectUrl = Url;
      this.logger.debug(`update ${asset.id} objectUrl ==> ${JSON.stringify(objectUrl)}`);
      await this.assetService.updateAssetObjectUrl(asset.id, objectUrl);
    }
  }
}
