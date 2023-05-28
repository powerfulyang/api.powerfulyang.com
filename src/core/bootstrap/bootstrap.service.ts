import { CacheService } from '@/common/cache/cache.service';
import { LoggerService } from '@/common/logger/logger.service';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';
import { CoreService } from '@/core/core.service';
import { BucketService } from '@/modules/bucket/bucket.service';
import { PathViewCountService } from '@/modules/path-view-count/path-view-count.service';
import { MenuService } from '@/modules/user/menu/menu.service';
import { RoleService } from '@/modules/user/role/role.service';
import { UserService } from '@/modules/user/user.service';
import { HOSTNAME } from '@/utils/hostname';
import { Injectable } from '@nestjs/common';
import { isProdProcess } from '@powerfulyang/utils';

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
        await this.cacheService.set(REDIS_KEYS.SCHEDULE_NODE, HOSTNAME);
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

  private async cacheUsers() {
    const bool = await this.coreService.isScheduleNode();
    if (bool) {
      await this.userService.cacheUsers();
    }
  }

  private async cachePathViewCount() {
    const bool = await this.coreService.isScheduleNode();
    if (bool) {
      await this.pathViewCountService.initPathViewCountCache();
    }
  }

  private async initBucket() {
    const bool = await this.coreService.isProdScheduleNode();
    if (bool) {
      await this.bucketService.initBucket();
    }
  }

  private async initIntendedData() {
    const bool = await this.coreService.isScheduleNode();
    if (bool) {
      await this.menuService.initBuiltinMenus();
      await this.roleService.initIntendedRoles();
      await this.userService.initIntendedUsers();
    }
  }
}
