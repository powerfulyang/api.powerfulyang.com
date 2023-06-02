import { Post } from '@/post/entities/post.entity';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

export class SearchPostDto extends PartialType(PickType(Post, ['publishYear'])) {
  @ApiProperty()
  declare publishYear?: number;
}
