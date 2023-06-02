import { Feed } from '@/feed/entities/feed.entity';
import { UploadAssetsDto } from '@/type/UploadFile';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFeedDto extends IntersectionType(
  PickType(Feed, ['content', 'createBy']),
  UploadAssetsDto,
) {
  @IsNotEmpty()
  @ApiProperty()
  declare content: string;

  @ApiProperty()
  declare public?: boolean;
}
