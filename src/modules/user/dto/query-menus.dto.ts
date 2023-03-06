import { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { Menu } from '@/modules/user/entities/menu.entity';

export class QueryMenusDto extends IntersectionType(
  PaginatedBaseQuery,
  PickType(Menu, ['id', 'name', 'path']),
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
