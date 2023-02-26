import { ApiProperty, PickType } from '@nestjs/swagger';
import { Role } from '@/modules/user/entities/role.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto extends PickType(Role, ['name']) {
  @ApiProperty({
    description: '角色名称',
  })
  @IsNotEmpty()
  name: string;
}
