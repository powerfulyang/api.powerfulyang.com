import { Post } from '@/entity/post.entity';
import { Length } from 'class-validator';

export class PostDto extends Post {
  @Length(1, 100)
  title: string;

  @Length(1, 10000)
  content: string;
}
