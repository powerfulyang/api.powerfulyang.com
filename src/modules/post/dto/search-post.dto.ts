import { Post } from '@/modules/post/entities/post.entity';
import { PartialType, PickType } from '@nestjs/swagger';

export class SearchPostDto extends PartialType(PickType(Post, ['publishYear'])) {}
