import type { ConfigService } from '@/common/config/config.service';
import { LoggerService } from '@/common/logger/logger.service';
import { REDIS_CONFIG } from '@/constants/PROVIDER_TOKEN';
import type { OnModuleDestroy } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { isNumber } from '@powerfulyang/utils';
import type { RedisKey } from 'ioredis';
import Redis from 'ioredis';

@Injectable()
export class CacheService extends Redis implements OnModuleDestroy {
  constructor(
    private readonly logger: LoggerService,
    @Inject(REDIS_CONFIG) config: ReturnType<ConfigService['getRedisConfig']>,
  ) {
    super(config);
    this.logger.setContext(CacheService.name);
  }

  onModuleDestroy() {
    this.disconnect();
  }

  async hGetJSON<T>(key: RedisKey, field: string | Buffer | number): Promise<T> {
    const f = isNumber(field) ? String(field) : field;
    const result = await this.hget(key, f);
    return result && JSON.parse(result);
  }

  async hSetJSON<T>(key: RedisKey, field: string | Buffer | number, value: T) {
    const f = isNumber(field) ? String(field) : field;
    return this.hset(key, f, JSON.stringify(value));
  }
}
