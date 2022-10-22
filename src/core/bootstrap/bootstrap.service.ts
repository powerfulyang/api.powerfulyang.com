import { Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { LoggerService } from '@/common/logger/logger.service';
import { CoreService } from '@/core/core.service';
import { PathViewCountService } from '@/modules/path-view-count/path-view-count.service';
import { BucketService } from '@/modules/bucket/bucket.service';
import { RoleService } from '@/modules/user/role/role.service';

@Injectable()
export class BootstrapService {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService,
    private readonly coreService: CoreService,
    private readonly pathViewCountService: PathViewCountService,
    private readonly bucketService: BucketService,
    private readonly roleService: RoleService,
  ) {
    this.logger.setContext(BootstrapService.name);
  }

  bootstrap() {
    return Promise.all([
      this.cacheUsers(),
      this.cachePathViewCount(),
      this.initBucket(),
      this.initIntendedData(),
    ]);
  }

  async cacheUsers() {
    const bool = await this.coreService.isScheduleNode();
    if (bool) {
      return this.userService
        .cacheUsers()
        .then(() => {
          this.logger.info('cacheUsers success!');
        })
        .catch((err) => {
          this.logger.error(err);
        });
    }
    return Promise.resolve();
  }

  async cachePathViewCount() {
    const bool = await this.coreService.isScheduleNode();
    if (bool) {
      return this.pathViewCountService
        .initPathViewCountCache()
        .then(() => {
          this.logger.info('cachePathViewCount success!');
        })
        .catch((err) => {
          this.logger.error(err);
        });
    }
    return Promise.resolve();
  }

  async initBucket() {
    const bool = await this.coreService.isProdScheduleNode();
    if (bool) {
      return this.bucketService
        .initBucket()
        .then(() => {
          this.logger.info('initBucket success!');
        })
        .catch((err) => {
          this.logger.error(err);
        });
    }
    return Promise.resolve();
  }

  async initIntendedData() {
    const bool = await this.coreService.isScheduleNode();
    if (bool) {
      const p1 = this.roleService.initIntendedRoles();
      const p2 = this.userService.initIntendedUsers();
      return Promise.all([p1, p2])
        .then(() => {
          this.logger.info('initIntendedData success!');
        })
        .catch((err) => {
          this.logger.error(err);
        });
    }
    return Promise.resolve();
  }
}
