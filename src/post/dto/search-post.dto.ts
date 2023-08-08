import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Post } from '@/post/entities/post.entity';

export class SearchPostDto extends PartialType(PickType(Post, ['publishYear'])) {
  @ApiProperty()
  declare publishYear?: number;
}
