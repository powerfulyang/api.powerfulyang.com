import type { FastifyRequest } from 'fastify';
import { Authorization } from '@/constants/constants';

export const getTokenFromRequest = (request: FastifyRequest) =>
  request.cookies?.[Authorization] || request?.headers[Authorization] || '';
