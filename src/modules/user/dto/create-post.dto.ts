import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { Post } from '@/modules/post/entities/post.entity';

export class CreatePostDto extends PartialType(Post) {
  @IsNotEmpty()
  declare title: string;

  @IsNotEmpty()
  declare content: string;
}
