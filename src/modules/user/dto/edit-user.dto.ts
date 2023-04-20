import { User } from '@/modules/user/entities/user.entity';
import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

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
