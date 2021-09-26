import { IsEmail } from 'class-validator';
import { User } from '@/modules/user/entities/user.entity';

export class UserDto extends User {
  @IsEmail()
  declare email: string;

  declare password: string;
}
