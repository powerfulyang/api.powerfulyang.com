import redisStore from 'cache-manager-redis-store';

export const redisConfig = () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  auth_pass: process.env.REDIS_PASS,
  store: redisStore,
  ttl: Infinity,
});
