import { User } from '@/entity/user.entity';

export interface Request extends Express.Request {
  user: User;
}
