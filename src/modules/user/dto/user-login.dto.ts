import { User } from '@/modules/user/entities/user.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserLoginDto extends PickType(User, ['email']) {
  @IsNotEmpty()
  @ApiProperty({ description: 'User password', example: '123456' })
  declare password: string;
}
