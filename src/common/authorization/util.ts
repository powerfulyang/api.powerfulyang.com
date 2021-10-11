import type { Request } from 'express';
import { Authorization } from '@/constants/constants';

export const getTokenFromRequest = (request: Request) => {
  return request?.cookies?.[Authorization] || request?.header(Authorization);
};
