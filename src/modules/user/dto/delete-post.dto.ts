import { IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Post } from '@/modules/post/entities/post.entity';

export class DeletePostDto extends PartialType(Post) {
  @IsNotEmpty()
  declare id: number;
}
