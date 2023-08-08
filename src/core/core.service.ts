import { Injectable } from '@nestjs/common';
import { isDevProcess, isProdProcess } from '@powerfulyang/utils';
import { CacheService } from '@/common/cache/cache.service';
import { LoggerService } from '@/common/logger/logger.service';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';
import { HOSTNAME } from '@/utils/hostname';

@Injectable()
export class CoreService {
  constructor(
    private readonly logger: LoggerService,
    private readonly cacheService: CacheService,
  ) {
    this.logger.setContext(CoreService.name);
  }

  async isScheduleNode() {
    const node = await this.getScheduleNode();
    return node === HOSTNAME || isDevProcess;
  }

  async isProdScheduleNode() {
    const bool = await this.isScheduleNode();
    return bool && isProdProcess;
  }

  private getScheduleNode() {
    return this.cacheService.get(REDIS_KEYS.SCHEDULE_NODE);
  }
}
