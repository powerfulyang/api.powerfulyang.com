import { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { Post } from '../entities/post.entity';

export class QueryPostsDto extends IntersectionType(
  PaginatedBaseQuery,
  PickType(Post, ['id', 'title', 'content', 'public', 'summary', 'poster', 'createBy']),
) {
  @ApiProperty({
    description: '创建时间',
    type: [Date, Date],
  })
  createdAt: [Date, Date];

  @ApiProperty({
    description: '更新时间',
    type: [Date, Date],
  })
  updatedAt: [Date, Date];
}
