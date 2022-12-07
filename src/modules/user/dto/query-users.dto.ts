import { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { User } from '@/modules/user/entities/user.entity';

export class QueryUsersDto extends IntersectionType(
  PaginatedBaseQuery,
  PickType(User, ['id', 'email', 'bio', 'nickname']),
) {
  createAt?: [Date, Date];

  updateAt?: [Date, Date];
}
