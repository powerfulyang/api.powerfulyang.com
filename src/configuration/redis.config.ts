export const redisConfig = () => {
  return {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    auth_pass: process.env.REDIS_PASS,
  };
};
