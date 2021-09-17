import { User } from '@/modules/user/entities/user.entity';

export type ReqExtend = {
  extend: {
    xRealIp: string;
    ip: string;
    address: string;
  };
  user: User & { exp: number };
};
