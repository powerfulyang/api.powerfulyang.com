import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { User } from '@/user/entities/user.entity';

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
