import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from '@/user/entities/user.entity';

export class UserLoginDto extends PickType(User, ['email']) {
  @IsNotEmpty()
  @ApiProperty({ description: 'User password', example: '123456' })
  declare password: string;
}
