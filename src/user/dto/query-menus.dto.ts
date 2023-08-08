import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { Menu } from '@/user/entities/menu.entity';

export class QueryMenusDto extends IntersectionType(
  PaginatedBaseQuery,
  PickType(Menu, ['id', 'name', 'path']),
) {
  @ApiProperty({
    type: [Date, Date],
  })
  createdAt?: [Date, Date];

  @ApiProperty({
    type: [Date, Date],
  })
  updatedAt?: [Date, Date];
}
