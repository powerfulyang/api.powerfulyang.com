import { Post } from '@/modules/post/entities/post.entity';
import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class SpecificPostDto extends PickType(Post, ['id']) {
  @IsNotEmpty()
  @IsNumberString()
  declare id: number;
}
