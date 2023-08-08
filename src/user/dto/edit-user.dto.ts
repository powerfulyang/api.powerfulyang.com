import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from '@/user/entities/user.entity';

export class EditUserDto extends PickType(User, ['email', 'nickname', 'bio', 'avatar']) {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  bio: string;

  @IsOptional()
  avatar?: string;
}
