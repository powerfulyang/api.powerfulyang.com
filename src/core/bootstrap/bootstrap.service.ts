import { CacheService } from '@/common/cache/cache.service';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';
import { HOSTNAME } from '@/utils/hostname';
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
    private readonly cacheService: CacheService,
  ) {
    this.logger.setContext(BootstrapService.name);
  }

  async bootstrap() {
    let result = 1;
    if (isProdProcess) {
      result = await this.cacheService.setnx(REDIS_KEYS.SCHEDULE_NODE_NX, HOSTNAME);
      if (result) {
        this.cacheService.set(REDIS_KEYS.SCHEDULE_NODE, HOSTNAME);
        await this.cacheService.expire(REDIS_KEYS.SCHEDULE_NODE_NX, 10);
      }
    }
    if (result) {
      // 10s 后过期
      await Promise.all([
        this.cacheUsers(),
        this.cachePathViewCount(),
        this.initBucket(),
        this.initIntendedData(),
      ]);
    }
    return true;
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
