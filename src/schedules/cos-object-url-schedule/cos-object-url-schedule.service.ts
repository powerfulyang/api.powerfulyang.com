import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { AssetService } from '@/modules/asset/asset.service';
import { AppLogger } from '@/common/logger/app.logger';
import { CoreService } from '@/core/core.service';

@Injectable()
export class CosObjectUrlScheduleService {
  constructor(
    private readonly assetService: AssetService,
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
      const objectUrl = await this.assetService.getObjectUrl(
        `${asset.sha1}.${asset.fileSuffix}`,
        asset.bucket,
      );
      this.logger.debug(`update ${asset.id} objectUrl ==> ${JSON.stringify(objectUrl)}`);
      await this.assetService.updateAssetObjectUrl(asset.id, objectUrl);
    }
  }
}
