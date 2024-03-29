import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { Feed } from '@/feed/entities/feed.entity';

export class SpecificFeedDto extends PickType(Feed, ['id']) {
  @IsNotEmpty()
  @IsNumberString()
  declare id: number;
}
