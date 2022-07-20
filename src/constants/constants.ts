import { InternalServerErrorException } from '@nestjs/common';
import type { Nullable } from '@powerfulyang/utils';
import type { CookieSerializeOptions } from '@fastify/cookie';

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

export const { SERVER_ORIGIN } = process.env;

export const DefaultCookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: true,
  domain: 'powerfulyang.com',
  /**
   * If both Expires and Max-Age are set, Max-Age has precedence.
   */
  maxAge: 24 * 60 * 60, // hours * minutes * seconds
  path: '/',
};
