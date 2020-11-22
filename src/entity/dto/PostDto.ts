import { Posts } from '@/entity/posts.entity';
import { Length } from 'class-validator';

export class PostDto extends Posts {
  @Length(1, 20)
  title: string;

  @Length(1, 10000)
  content: string;
}
