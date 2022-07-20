import type { FastifyRequest } from 'fastify';
import type { User } from '@/modules/user/entities/user.entity';

export interface RequestExtend extends FastifyRequest {
  raw: FastifyRequest['raw'] & {
    extend: {
      xRealIp: string;
      address: string;
    };
  };
  user: User & { exp: number };
}
