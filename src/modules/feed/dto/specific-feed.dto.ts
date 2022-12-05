import { IsNotEmpty, IsNumberString } from 'class-validator';
import { Feed } from '@/modules/feed/entities/feed.entity';
import { PickType } from '@nestjs/swagger';

export class SpecificFeedDto extends PickType(Feed, ['id']) {
  @IsNotEmpty()
  @IsNumberString()
  declare id: number;
}
