import { Authorization } from '@/constants/constants';
import type { FastifyRequest } from 'fastify';

export const getTokenFromRequest = (request: FastifyRequest) =>
  request.cookies?.[Authorization] || request?.headers[Authorization] || '';
