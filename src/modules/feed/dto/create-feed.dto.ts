import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { Feed } from '@/modules/feed/entities/feed.entity';

export class CreateFeedDto extends PartialType(Feed) {
  @IsNotEmpty()
  declare content: string;
}
