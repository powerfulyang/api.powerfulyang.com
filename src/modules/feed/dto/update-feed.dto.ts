import { Feed } from '@/modules/feed/entities/feed.entity';
import { IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';
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
