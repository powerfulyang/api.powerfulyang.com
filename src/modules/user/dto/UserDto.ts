import { User } from '@/modules/user/entities/user.entity';
import { IsEmail } from 'class-validator';

export class UserDto extends User {
  @IsEmail()
  email: string;
}
