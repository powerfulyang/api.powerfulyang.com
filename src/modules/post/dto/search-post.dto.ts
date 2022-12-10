import { PartialType, PickType } from '@nestjs/swagger';
import { Post } from '@/modules/post/entities/post.entity';

export class SearchPostDto extends PartialType(PickType(Post, ['publishYear'])) {}
