import type { FastifyRequest } from 'fastify';
import type { User } from '@/modules/user/entities/user.entity';

export interface ExtendRequest extends FastifyRequest {
  raw: FastifyRequest['raw'] & {
    extend: {
      xRealIp: string;
      address: string;
      start: number;
    };
  };
  user: User & { exp: number };
}
