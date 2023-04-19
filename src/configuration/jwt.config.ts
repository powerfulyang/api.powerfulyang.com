import process from 'node:process';

export const jwtSecretConfig = () => {
  return {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d', // 默认过期时间为1天
  };
};
