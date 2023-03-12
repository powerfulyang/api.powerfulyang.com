import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
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

  /**
   * 每月1号执行一次
   */
  @Cron('0 0 0 1 * *')
  async refreshObjectUrl() {
    const bool = await this.coreService.isProdScheduleNode();
    if (bool) {
      this.logger.info('===========每个月1号刷新资源的COS对象链接===========');
      await this.main();
    }
  }

  async main() {
    const assets = await this.assetService.allAssets();
    return Promise.allSettled(
      assets.map((asset) => {
        return this.assetService
          .getObjectUrl(`${asset.sha1}.${asset.fileSuffix}`, asset.bucket)
          .then((objectUrl) => {
            this.logger.debug(`获取 objectUtl 成功: ${JSON.stringify(objectUrl, null, 2)}`);
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
