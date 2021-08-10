import { User } from '@/entity/user.entity';

export type ReqExtend = {
  extend: {
    ip: string;
    address: string;
  };
  user: User & { exp: number };
};
