import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { Post } from '../entities/post.entity';

export class PaginateQueryPostDto extends IntersectionType(
  PaginatedBaseQuery,
  PickType(Post, ['id', 'title', 'content', 'public', 'content', 'summary', 'poster', 'createBy']),
) {
  @ApiProperty({
    description: '创建时间',
    type: [Date, Date],
  })
  createAt: [Date, Date];

  @ApiProperty({
    description: '更新时间',
    type: [Date, Date],
  })
  updateAt: [Date, Date];
}
