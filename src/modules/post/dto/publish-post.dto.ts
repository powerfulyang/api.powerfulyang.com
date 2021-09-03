import { Post } from '@/modules/post/entities/post.entity';
import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

export class PublishPostDto extends PartialType(Post) {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;
}
