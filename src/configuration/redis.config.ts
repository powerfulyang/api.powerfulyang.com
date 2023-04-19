import type { RedisOptions } from 'ioredis/built/redis/RedisOptions';
import process from 'node:process';

export const redisConfig = (): RedisOptions => ({
  password: process.env.REDIS_PASS,
  db: 0,
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
});
