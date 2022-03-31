import { Injectable } from '@nestjs/common';
import { isProdProcess } from '@powerfulyang/utils';
import { CacheService } from '@/common/cache/cache.service';
import { HOSTNAME } from '@/utils/hostname';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';
import { AppLogger } from '@/common/logger/app.logger';
import { checkRedisResult } from '@/constants/constants';

@Injectable()
export class CoreService {
  constructor(private readonly logger: AppLogger, private readonly cacheService: CacheService) {
    this.logger.setContext(CoreService.name);
    this.initScheduleNode().then((node) => {
      this.logger.info(`当前环境 ====> ${process.env.NODE_ENV}`);
      this.logger.info(`node ====> ${node}`);
    });
  }

  async initScheduleNode() {
    const result = await this.cacheService.set(REDIS_KEYS.SCHEDULE_NODE, HOSTNAME);
    checkRedisResult(result);
    return HOSTNAME;
  }

  private getScheduleNode() {
    return this.cacheService.get(REDIS_KEYS.SCHEDULE_NODE);
  }

  async isScheduleNode() {
    const node = await this.getScheduleNode();
    return node === HOSTNAME;
  }

  async isProdScheduleNode() {
    const bool = await this.isScheduleNode();
    return bool && isProdProcess;
  }
}
