import { InternalServerErrorException } from '@nestjs/common';
import type { Nullable } from '@powerfulyang/utils';

export const MICROSERVICE_NAME = Symbol('RABBIT_MQ_MICROSERVICE');
export const RMQ_QUEUE = 'COS_UPLOAD';
export const SUCCESS = 'SUCCESS';
export const REDIS_OK = 'OK';
export const checkRedisResult = (result: Nullable<string>, message?: string) => {
  if (result !== REDIS_OK) {
    throw new InternalServerErrorException(message);
  }
};

export const Authorization = 'authorization';

export const { SERVER_HOST_DOMAIN } = process.env;
export const CookieOptions = {
  httpOnly: true,
  sameSite: true,
  secure: true,
  domain: SERVER_HOST_DOMAIN,
  maxAge: 24 * 60 * 60 * 1000,
};
export const PRIMARY_ORIGIN = `https://${SERVER_HOST_DOMAIN}`;
