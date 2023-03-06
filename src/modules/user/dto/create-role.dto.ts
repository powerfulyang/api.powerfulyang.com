import { ApiProperty, PickType } from '@nestjs/swagger';
import { Role } from '@/modules/user/entities/role.entity';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleDto extends PickType(Role, ['name']) {
  @ApiProperty({
    description: '角色名称',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '角色拥有的菜单',
  })
  @IsOptional()
  @IsArray()
  menus?: number[];
}
