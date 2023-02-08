import { IsNotEmpty } from 'class-validator';
import { Feed } from '@/modules/feed/entities/feed.entity';
import '@nestjs/mapped-types';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { UploadAssetsDto } from '@/type/UploadFile';

export class CreateFeedDto extends IntersectionType(
  PickType(Feed, ['content', 'createBy']),
  UploadAssetsDto,
) {
  @IsNotEmpty()
  declare content: string;

  declare public?: boolean;
}
