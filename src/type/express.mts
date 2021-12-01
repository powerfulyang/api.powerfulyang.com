import type { User } from '@/modules/user/entities/user.entity.mjs';

export interface Request extends Express.Request {
  user: User;
}
