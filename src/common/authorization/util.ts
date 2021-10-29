import type { Request } from 'express';
import { Authorization } from '@/constants/constants';

export const getTokenFromRequest = (request: Request) => request?.cookies?.[Authorization] || request?.header(Authorization);
