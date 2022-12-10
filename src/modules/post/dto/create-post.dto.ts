import { OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Length } from 'class-validator';
import { Post } from '@/modules/post/entities/post.entity';
import type { User } from '@/modules/user/entities/user.entity';

export class CreatePostDto extends PartialType(OmitType(Post, ['id'])) {
  @Length(1, 30)
  @IsNotEmpty()
  declare title: string;

  @IsNotEmpty()
  declare content: string;

  @IsOptional()
  @IsNumber()
  declare posterId?: number;

  declare createBy: User;
}
