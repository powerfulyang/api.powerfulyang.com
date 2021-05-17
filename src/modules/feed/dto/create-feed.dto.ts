import { Feed } from '@/modules/feed/entities/feed.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateFeedDto extends Feed {
  @IsNotEmpty()
  content: string;
}
