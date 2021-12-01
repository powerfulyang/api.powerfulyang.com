import type { User } from '@/modules/user/entities/user.entity.mjs';

export type ReqExtend = {
  extend: {
    xRealIp: string;
    address: string;
  };
  user: User & { exp: number };
};
