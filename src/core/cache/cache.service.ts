import { Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';
import type { Dict } from '@powerfulyang/utils';
import { isDefined, isString } from '@powerfulyang/utils';
import { createClient } from 'redis';
import { AppLogger } from '@/common/logger/app.logger';
import { ConfigService } from '@/core/config/config.service';

@Injectable()
export class CacheService {
  private readonly redisClient: RedisClientType<any, any>;

  constructor(private readonly logger: AppLogger, private readonly configService: ConfigService) {
    this.logger.setContext(CacheService.name);
    this.redisClient = createClient(this.configService.getRedisConfig());
    this.redisClient.connect();
  }

  /**
   * Set a key value pair in redis
   * @param key
   * @param value
   */
  set(key: string, value: string) {
    return this.redisClient.set(key, value);
  }

  /**
   * Get a value from redis
   * @param key
   */
  get(key: string) {
    return this.redisClient.get(key);
  }

  hSet(key: string, value: Dict): Promise<number>;
  hSet(key: string, field: string, value: Dict): Promise<number>;

  /**
   * Hash set a key value pair in redis
   * @param hash
   * @param field
   * @param value
   */
  hSet(hash: string, field: string | Dict, value?: Dict) {
    if (isString(field)) {
      return this.redisClient.hSet(hash, field, JSON.stringify(value));
    }
    const newField = Object.create({});
    Object.keys(field).forEach((key) => {
      const v = JSON.stringify(Reflect.get(field, key));
      Reflect.set(newField, key, v);
    });
    return this.redisClient.hSet(hash, newField);
  }

  /**
   * Hash get a value from redis
   * @param hash
   * @param field
   */
  async hGet<T = any>(hash: string, field: string): Promise<T> {
    const val = await this.redisClient.hGet(hash, field);
    return isDefined(val) ? JSON.parse(val) : val;
  }

  /**
   * sAdd a value to a set in redis
   * @param sKey
   * @param arr
   */
  sAdd(sKey: string, arr: string | string[]) {
    return this.redisClient.sAdd(sKey, arr);
  }

  /**
   * sCard get the cardinality of a set in redis
   * @param sKey
   */
  sCard(sKey: string) {
    return this.redisClient.sCard(sKey);
  }

  /**
   * sIsMember check if a value is a member of a set in redis
   */
  sIsMember(sKey: string, value: string) {
    return this.redisClient.sIsMember(sKey, value);
  }

  /**
   * sMembers get all the members of a set in redis
   */
  sMembers(sKey: string) {
    return this.redisClient.sMembers(sKey);
  }

  /**
   * del a key from redis
   * @param key
   */
  del(key: string) {
    return this.redisClient.del(key);
  }
}
