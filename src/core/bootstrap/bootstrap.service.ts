import { Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { AppLogger } from '@/common/logger/app.logger';
import { CoreService } from '@/core/core.service';
import { CosObjectUrlScheduleService } from '@/schedules/cos-object-url-schedule/cos-object-url-schedule.service';
import { PathViewCountService } from '@/modules/path-ip-view-count/path-view-count.service';

@Injectable()
export class BootstrapService {
  constructor(
    private readonly userService: UserService,
    private readonly logger: AppLogger,
    private readonly coreService: CoreService,
    private readonly cosObjectUrlScheduleService: CosObjectUrlScheduleService,
    private readonly pathViewCountService: PathViewCountService,
  ) {
    this.logger.setContext(BootstrapService.name);
  }

  async bootstrap() {
    setTimeout(() => {
      this.cacheUsers();
      this.refreshObjectUrl();
      this.cachePathViewCount();
      this.initBucket();
    }, 1000 * 10);
  }

  async refreshObjectUrl() {
    const bool = await this.coreService.isProdCommonNode();
    if (bool) {
      this.cosObjectUrlScheduleService.refreshObjectUrl().then(() => {
        this.logger.info('每次重启的时候需要刷新一下 object url!');
      });
    }
  }

  async cacheUsers() {
    const bool = await this.coreService.isCommonNode();
    if (bool) {
      // cache users
      this.userService.cacheUsers().then(() => {
        this.logger.info('cache users in redis success!');
      });
    }
  }

  async cachePathViewCount() {
    const bool = await this.coreService.isCommonNode();
    if (bool) {
      this.pathViewCountService.cache().then(() => {
        this.logger.info('path view count map cached success!');
      });
    }
  }

  async initBucket() {
    const bool = await this.coreService.isCommonNode();
    if (bool) {
      this.coreService.initBucket().then(() => {
        this.logger.info('init buckets complete!');
      });
    }
  }
}
