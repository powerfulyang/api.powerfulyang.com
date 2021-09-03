import { Feed } from '@/modules/feed/entities/feed.entity';
import { IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateFeedDto extends PartialType(Feed) {
  @IsNotEmpty()
  content: string;
}
