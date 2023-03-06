import { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { User } from '@/modules/user/entities/user.entity';

export class QueryUsersDto extends IntersectionType(
  PaginatedBaseQuery,
  PickType(User, ['id', 'email', 'bio', 'nickname']),
) {
  @ApiProperty({
    description: '创建时间',
    type: [Date, Date],
  })
  createAt?: [Date, Date];

  @ApiProperty({
    description: '更新时间',
    type: [Date, Date],
  })
  updateAt?: [Date, Date];
}
