import { User } from '@/entity/user.entity';

export type ReqExtend = {
  extend: {
    xRealIp: string;
    ip: string;
    address: string;
  };
  user: User & { exp: number };
};
