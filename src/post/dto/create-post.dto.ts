import { Field, InputType } from '@nestjs/graphql';
import { ApiHideProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Length } from 'class-validator';
import { User } from '@/user/entities/user.entity';
import { Post } from '@/post/entities/post.entity';

@InputType()
export class CreatePostDto extends PartialType(OmitType(Post, ['id'])) {
  @Length(1, 100)
  @IsNotEmpty()
  @Field()
  declare title: string;

  @IsNotEmpty()
  declare content: string;

  @IsOptional()
  @IsNumber()
  declare posterId?: number;

  @ApiHideProperty()
  declare createBy?: User;
}
