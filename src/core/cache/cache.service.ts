import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { RedisClient } from 'redis';
import { promisify } from 'util';
import { AppLogger } from '@/common/logger/app.logger';

@Injectable()
export class CacheService {
  private readonly redisClient: RedisClient;

  constructor(
    @Inject(CACHE_MANAGER)
    private redisStore: {
      store: { getClient: () => RedisClient };
    },
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(CacheService.name);
    this.redisClient = this.redisStore.store.getClient();
  }

  hashSet<T = any>(hash: string, key: string | number, val: T) {
    const value = JSON.stringify(val);
    return promisify(<any>this.redisClient.hset).call(this.redisClient, hash, key, value);
  }

  async hashGet<T = any>(hash: string, key: string | number): Promise<T> {
    const val = await promisify(this.redisClient.hget).call(this.redisClient, hash, <any>key);
    return JSON.parse(val);
  }
}
