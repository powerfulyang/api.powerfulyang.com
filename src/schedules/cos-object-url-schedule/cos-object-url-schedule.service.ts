import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { AssetService } from '@/modules/asset/asset.service';
import { LoggerService } from '@/common/logger/logger.service';
import { CoreService } from '@/core/core.service';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class CosObjectUrlScheduleService {
  constructor(
    private readonly assetService: AssetService,
    private readonly logger: LoggerService,
    private readonly coreService: CoreService,
    private readonly userService: UserService,
  ) {
    this.logger.setContext(CosObjectUrlScheduleService.name);
  }

  @Interval(60 * 60 * 24 * 999)
  async refreshObjectUrl() {
    const bool = await this.coreService.isProdScheduleNode();
    if (bool) {
      this.logger.info('===========每24小时刷新资源的COS对象链接===========');
      await this.main();
    }
  }

  async main() {
    const assets = await this.assetService.all();
    Promise.allSettled(
      assets.map((asset) => {
        return this.assetService
          .getObjectUrl(`${asset.sha1}.${asset.fileSuffix}`, asset.bucket)
          .then((objectUrl) => {
            return this.assetService.updateAssetObjectUrl(asset.id, objectUrl);
          })
          .catch((err) => {
            this.logger.error(err);
          });
      }),
    ).then(() => {
      return this.userService.cacheUsers().catch(() => {
        this.logger.error('刷新用户背景失败啦!!!');
      });
    });
  }
}
