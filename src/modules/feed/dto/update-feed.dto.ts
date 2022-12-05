import { IsNotEmpty, IsNumberString } from 'class-validator';
import { IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { Feed } from '@/modules/feed/entities/feed.entity';
import { CreateFeedDto } from './create-feed.dto';

export class UpdateFeedDto extends IntersectionType(
  OmitType(CreateFeedDto, ['createBy']),
  PickType(Feed, ['updateBy']),
) {
  @IsNotEmpty()
  @IsNumberString()
  declare id: number;

  @IsNotEmpty()
  declare content: string;

  declare public: boolean;
}
