import { User } from '@/modules/user/entities/user.entity.mjs';

export class UserDto extends User {
  password: string;
}
