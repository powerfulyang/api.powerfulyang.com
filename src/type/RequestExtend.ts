import type { Request } from 'express';
import type { User } from '@/modules/user/entities/user.entity';

export interface RequestExtend extends Request {
  extend: {
    xRealIp: string;
    address: string;
  };
  user: User & { exp: number };
}
