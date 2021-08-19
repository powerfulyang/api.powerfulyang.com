import { UserService } from '@/modules/user/user.service';
import { AppLogger } from '@/common/logger/app.logger';
import { CoreService } from '@/core/core.service';

export class BootstrapService {
  constructor(
    private readonly userService: UserService,
    private readonly logger: AppLogger,
    private readonly coreService: CoreService,
  ) {
    this.logger.setContext(BootstrapService.name);
    setTimeout(() => {
      this.bootstrap().then(() => {
        this.logger.info('bootstrap script!');
      });
    }, 1000 * 10);
  }

  async bootstrap() {
    const bool = await this.coreService.isCommonNode();
    if (bool) {
      // cache users
      this.userService.cacheUsers().then(() => {
        this.logger.info('cache users in redis success!');
      });
    }
  }
}
