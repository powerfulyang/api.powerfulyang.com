import { Injectable } from '@nestjs/common';
import { isProdProcess } from '@powerfulyang/utils';
import { CacheService } from '@/common/cache/cache.service';
import { LoggerService } from '@/common/logger/logger.service';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';
import { CoreService } from '@/core/core.service';
import { BucketService } from '@/bucket/bucket.service';
import { MenuService } from '@/user/menu/menu.service';
import { RoleService } from '@/user/role/role.service';
import { UserService } from '@/user/user.service';
import { HOSTNAME } from '@/utils/hostname';

@Injectable()
export class BootstrapService {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService,
    private readonly coreService: CoreService,
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
      await Promise.all([this.cacheUsers(), this.initBucket(), this.initIntendedData()]);
    }
    return true;
  }

  private async cacheUsers() {
    const bool = await this.coreService.isScheduleNode();
    if (bool) {
      await this.userService.cacheUsers();
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
