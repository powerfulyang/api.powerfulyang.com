import { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { Role } from '@/modules/user/entities/role.entity';

export class QueryRolesDto extends IntersectionType(
  PaginatedBaseQuery,
  PickType(Role, ['id', 'name']),
) {
  @ApiProperty({
    type: [Date, Date],
  })
  createAt?: [Date, Date];

  @ApiProperty({
    type: [Date, Date],
  })
  updateAt?: [Date, Date];
}
