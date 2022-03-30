import { PickType } from '@nestjs/mapped-types';
import { Post } from '@/modules/post/entities/post.entity';

export class SearchPostDto extends PickType(Post, ['publishYear']) {}
