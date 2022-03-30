import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { User } from '@/modules/user/entities/user.entity';

export class UserLoginDto extends PartialType(User) {
  @IsNotEmpty()
  declare email: string;

  @IsNotEmpty()
  declare password: string;
}
