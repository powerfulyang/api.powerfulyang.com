import { Feed } from '@/modules/feed/entities/feed.entity';
import { UploadAssetsDto } from '@/type/UploadFile';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFeedDto extends IntersectionType(
  PickType(Feed, ['content', 'createBy']),
  UploadAssetsDto,
) {
  @IsNotEmpty()
  declare content: string;

  declare public?: boolean;
}
