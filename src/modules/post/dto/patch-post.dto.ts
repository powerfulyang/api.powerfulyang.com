import { CreatePostDto } from '@/modules/post/dto/create-post.dto';
import { User } from '@/modules/user/entities/user.entity';
import { ApiHideProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Length } from 'class-validator';

export class PatchPostDto extends PartialType(CreatePostDto) {
  @IsNotEmpty()
  @IsNumber()
  declare id: number;

  @Length(1, 100)
  @IsNotEmpty()
  declare title: string;

  @IsNotEmpty()
  declare content: string;

  declare posterId?: number;

  @ApiHideProperty()
  declare updateBy: User;
}
