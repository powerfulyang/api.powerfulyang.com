import { Injectable } from '@nestjs/common';
import { isProdProcess } from '@powerfulyang/utils';
import { CacheService } from '@/common/cache/cache.service';
import { HOSTNAME } from '@/utils/hostname';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';
import { LoggerService } from '@/common/logger/logger.service';
import { checkRedisResult } from '@/constants/constants';

@Injectable()
export class CoreService {
  constructor(private readonly logger: LoggerService, private readonly cacheService: CacheService) {
    this.logger.setContext(CoreService.name);
    if (isProdProcess) {
      this.initScheduleNode()
        .then((hostname) => {
          this.logger.info(
            `NODE_ENV ====> ${process.env.NODE_ENV || 'UNSET'}, HOSTNAME ====> ${hostname}`,
          );
        })
        .catch((err) => {
          this.logger.error(err);
        });
    }
  }

  async initScheduleNode() {
    const result = await this.cacheService.set(REDIS_KEYS.SCHEDULE_NODE, HOSTNAME);
    checkRedisResult(result);
    return HOSTNAME;
  }

  async isScheduleNode() {
    const node = await this.getScheduleNode();
    return node === HOSTNAME;
  }

  async isProdScheduleNode() {
    const bool = await this.isScheduleNode();
    return bool && isProdProcess;
  }

  private getScheduleNode() {
    return this.cacheService.get(REDIS_KEYS.SCHEDULE_NODE);
  }
}
