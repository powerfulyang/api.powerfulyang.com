import { Length } from 'class-validator';
import { Post } from '@/modules/post/entities/post.entity';

export class PostDto extends Post {
  @Length(1, 100)
  declare title: string;

  @Length(1, 10000)
  declare content: string;
}
