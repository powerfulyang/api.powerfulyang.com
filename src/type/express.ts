import { User } from '@/modules/user/entities/user.entity';

export interface Request extends Express.Request {
  user: User;
}
