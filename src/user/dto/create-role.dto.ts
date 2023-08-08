import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from '@/user/entities/role.entity';

export class CreateRoleDto extends PickType(Role, ['name', 'permissions']) {
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
