import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import type { RedisClient } from 'redis';
import { promisify } from 'util';
import { AppLogger } from '@/common/logger/app.logger';
import type { RedisValue } from '@/type/RedisValue';

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

  set(key: string, value: string) {
    return promisify(this.redisClient.set).call(this.redisClient, key, value);
  }

  get(key: string) {
    return promisify(this.redisClient.get).call(this.redisClient, key);
  }

  hSet<T = any>(hash: string, hKey: string | number, val: T) {
    const value = JSON.stringify(val);
    return promisify(<any>this.redisClient.hset).call(this.redisClient, hash, hKey, value);
  }

  async hGet<T = any>(hash: string, hKey: string | number): Promise<T> {
    const val = await promisify(this.redisClient.hget).call(this.redisClient, hash, <any>hKey);
    return JSON.parse(val);
  }

  hMSet(hash: string, map: Record<string, RedisValue>) {
    return promisify(<any>this.redisClient.hmset).call(this.redisClient, hash, map);
  }

  sAdd(sKey: string, arr: RedisValue[] | RedisValue) {
    return promisify(<any>this.redisClient.sadd).call(this.redisClient, sKey, arr);
  }

  sCard(sKey: string) {
    return promisify(this.redisClient.scard).call(this.redisClient, sKey);
  }

  del(key: string) {
    return promisify(<any>this.redisClient.del).call(this.redisClient, key);
  }
}
