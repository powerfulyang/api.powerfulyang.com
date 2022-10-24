import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { Feed } from '@/modules/feed/entities/feed.entity';

export class DeleteFeedDto extends PartialType(Feed) {
  @IsNotEmpty()
  @IsNumberString()
  declare id: number;
}
