import { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { Menu } from '@/user/entities/menu.entity';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';

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
