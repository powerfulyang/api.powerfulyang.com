import type { CookieSerializeOptions } from '@fastify/cookie';
import { InternalServerErrorException } from '@nestjs/common';
import type { Nullable } from '@powerfulyang/utils';
import { isProdProcess, isDevProcess } from '@powerfulyang/utils';

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

export const Default_Auth_Success_Target_Url = 'https://powerfulyang.com';

export const DefaultCookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: !isDevProcess,
  domain: 'powerfulyang.com',
  maxAge: 24 * 60 * 60, // hours * minutes * seconds
  path: '/',
};

export const DEFAULT_R2_BUCKET_NAME = isProdProcess ? 'eleven' : 'test';
