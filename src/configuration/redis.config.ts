import type { RedisClientOptions } from 'redis';

export const redisConfig = (): RedisClientOptions<any, any> => ({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASS,
  database: 0,
});
