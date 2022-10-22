import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, Length } from 'class-validator';
import { Post } from '@/modules/post/entities/post.entity';
import type { User } from '@/modules/user/entities/user.entity';

export class PublishNewPostDto extends PartialType(OmitType(Post, ['id'])) {
  @Length(1, 30)
  @IsNotEmpty()
  declare title: string;

  @IsNotEmpty()
  declare content: string;

  declare posterId?: number;

  declare createBy: User;
}
