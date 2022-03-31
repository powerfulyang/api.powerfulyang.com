import { Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { AppLogger } from '@/common/logger/app.logger';
import { CoreService } from '@/core/core.service';
import { CosObjectUrlScheduleService } from '@/schedules/cos-object-url-schedule/cos-object-url-schedule.service';
import { PathViewCountService } from '@/modules/path-ip-view-count/path-view-count.service';
import { BucketService } from '@/modules/bucket/bucket.service';
import { RoleService } from '@/modules/user/role/role.service';

@Injectable()
export class BootstrapService {
  constructor(
    private readonly userService: UserService,
    private readonly logger: AppLogger,
    private readonly coreService: CoreService,
    private readonly cosObjectUrlScheduleService: CosObjectUrlScheduleService,
    private readonly pathViewCountService: PathViewCountService,
    private readonly bucketService: BucketService,
    private readonly roleService: RoleService,
  ) {
    this.logger.setContext(BootstrapService.name);
  }

  bootstrap() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        Promise.all([
          this.cacheUsers(),
          this.refreshObjectUrl(),
          this.cachePathViewCount(),
          this.initBucket(),
          this.initIntendedData(),
        ]).then(() => {
          resolve();
        });
      }, 1000 * 10);
    });
  }

  async refreshObjectUrl() {
    const bool = await this.coreService.isProdScheduleNode();
    if (bool) {
      this.cosObjectUrlScheduleService.refreshObjectUrl().then(() => {
        this.logger.info('每次重启的时候需要刷新一下 object url!');
      });
    }
  }

  async cacheUsers() {
    const bool = await this.coreService.isScheduleNode();
    if (bool) {
      // cache users
      this.userService.cacheUsers().then(() => {
        this.logger.info('cache users in redis success!');
      });
    }
  }

  async cachePathViewCount() {
    const bool = await this.coreService.isScheduleNode();
    if (bool) {
      this.pathViewCountService.initPathViewCountCache().then(() => {
        this.logger.info('path view count map cached success!');
      });
    }
  }

  async initBucket() {
    const bool = await this.coreService.isScheduleNode();
    if (bool) {
      this.bucketService.initBucket().then(() => {
        this.logger.info('init buckets complete!');
      });
    }
  }

  async initIntendedData() {
    const bool = await this.coreService.isScheduleNode();
    if (bool) {
      this.roleService.initIntendedRoles().then(() => {
        this.logger.info('init roles complete!');
      });
      this.userService.initIntendedUsers().then(() => {
        this.logger.info('init users complete!');
      });
    }
  }
}
