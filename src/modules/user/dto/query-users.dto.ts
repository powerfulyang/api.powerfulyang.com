import { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { User } from '@/modules/user/entities/user.entity';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';

export class QueryUsersDto extends IntersectionType(
  PaginatedBaseQuery,
  PickType(User, ['id', 'email', 'bio', 'nickname']),
) {
  @ApiProperty({
    description: '创建时间',
    type: [Date, Date],
  })
  createdAt?: [Date, Date];

  @ApiProperty({
    description: '更新时间',
    type: [Date, Date],
  })
  updatedAt?: [Date, Date];
}
