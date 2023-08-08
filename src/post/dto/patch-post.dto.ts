import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Length } from 'class-validator';
import { CreatePostDto } from '@/post/dto/create-post.dto';
import { User } from '@/user/entities/user.entity';

export class PatchPostDto extends PartialType(CreatePostDto) {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  declare id: number;

  @Length(1, 100)
  @IsNotEmpty()
  @ApiProperty()
  declare title: string;

  @IsNotEmpty()
  @ApiProperty()
  declare content: string;

  @ApiProperty({
    required: false,
  })
  declare posterId?: number;

  @ApiHideProperty()
  declare updateBy: User;
}
