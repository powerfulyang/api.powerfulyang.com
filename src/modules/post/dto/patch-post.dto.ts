import { ApiHideProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
import { User } from '@/modules/user/entities/user.entity';
import { CreatePostDto } from '@/modules/post/dto/create-post.dto';

export class PatchPostDto extends PartialType(CreatePostDto) {
  @ApiHideProperty()
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
