import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, Length } from 'class-validator';
import { Post } from '@/modules/post/entities/post.entity';

export class PublishPostDto extends PartialType(Post) {
  @Length(1, 30)
  declare title: string;

  @IsNotEmpty()
  declare content: string;
}
