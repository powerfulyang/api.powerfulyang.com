import { InternalServerErrorException } from '@nestjs/common';
import type { Nullable } from '@powerfulyang/utils';
import type { CookieOptions } from 'express';

export const MICROSERVICE_NAME = Symbol('RABBIT_MQ_MICROSERVICE');
export const RMQ_COS_UPLOAD_QUEUE = 'RABBIT_MQ_COS_UPLOAD_QUEUE';
export const SUCCESS = 'SUCCESS';

export const REDIS_OK = 'OK';
export const checkRedisResult = (result: Nullable<string>, message?: string) => {
  if (result !== REDIS_OK) {
    throw new InternalServerErrorException(message);
  }
};

export const Authorization = 'authorization';

export const { COOKIE_DOMAIN, SERVER_ORIGIN } = process.env;

export const DefaultCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: true,
  domain: COOKIE_DOMAIN,
  maxAge: 24 * 60 * 60 * 1000,
};
