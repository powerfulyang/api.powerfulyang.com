import { Injectable } from '@nestjs/common';
import { isProdProcess } from '@powerfulyang/utils';
import { UserService } from '@/modules/user/user.service';
import { LoggerService } from '@/common/logger/logger.service';
import { CoreService } from '@/core/core.service';
import { PathViewCountService } from '@/modules/path-view-count/path-view-count.service';
import { BucketService } from '@/modules/bucket/bucket.service';
import { RoleService } from '@/modules/user/role/role.service';
import { MenuService } from '@/modules/user/menu/menu.service';

@Injectable()
export class BootstrapService {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService,
    private readonly coreService: CoreService,
    private readonly pathViewCountService: PathViewCountService,
    private readonly bucketService: BucketService,
    private readonly roleService: RoleService,
    private readonly menuService: MenuService,
  ) {
    this.logger.setContext(BootstrapService.name);
  }

  bootstrap() {
    if (isProdProcess) {
      // 因为这里是异步的，所以 bootstrap 的主任务延迟一下
      this.coreService
        .leadScheduleNode()
        .then((hostname) => {
          this.logger.info(
            `NODE_ENV ====> ${process.env.NODE_ENV || 'UNSET'}, HOSTNAME ====> ${hostname}`,
          );
        })
        .catch((err) => {
          this.logger.error(err);
        });
    }
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        Promise.all([
          this.cacheUsers(),
          this.cachePathViewCount(),
          this.initBucket(),
          this.initIntendedData(),
        ])
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      }, (isProdProcess && 1000 * 10) || 0);
    });
  }

  async cacheUsers() {
    const bool = await this.coreService.isScheduleNode();
    if (bool) {
      return this.userService.cacheUsers();
    }
    return Promise.resolve();
  }

  async cachePathViewCount() {
    const bool = await this.coreService.isScheduleNode();
    if (bool) {
      return this.pathViewCountService.initPathViewCountCache();
    }
    return Promise.resolve();
  }

  async initBucket() {
    const bool = await this.coreService.isProdScheduleNode();
    if (bool) {
      return this.bucketService.initBucket();
    }
    return Promise.resolve();
  }

  async initIntendedData() {
    const bool = await this.coreService.isScheduleNode();
    if (bool) {
      await this.menuService.initBuiltinMenus();
      await this.roleService.initIntendedRoles();
      await this.userService.initIntendedUsers();
    }
    return Promise.resolve();
  }
}
