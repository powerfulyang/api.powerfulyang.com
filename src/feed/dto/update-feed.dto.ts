import { ApiProperty, IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { Feed } from '@/feed/entities/feed.entity';
import { CreateFeedDto } from './create-feed.dto';

export class UpdateFeedDto extends IntersectionType(
  OmitType(CreateFeedDto, ['createBy']),
  PickType(Feed, ['updateBy']),
) {
  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty()
  declare id: number;

  @IsNotEmpty()
  @ApiProperty()
  declare content: string;

  @ApiProperty()
  declare public: boolean;
}
