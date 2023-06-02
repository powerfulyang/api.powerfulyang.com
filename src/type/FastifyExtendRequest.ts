import type { User } from '@/user/entities/user.entity';
import type { FastifyRequest } from 'fastify';

export interface FastifyExtendRequest extends FastifyRequest {
  raw: FastifyRequest['raw'] & {
    extend: {
      xRealIp: string;
      address: string;
      start: number;
    };
  };
  user: User & { exp: number };
}
