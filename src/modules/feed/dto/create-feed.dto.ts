import { IsNotEmpty } from 'class-validator';
import { Feed } from '@/modules/feed/entities/feed.entity';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { UploadFilesDto } from '@/type/UploadFile';

export class CreateFeedDto extends IntersectionType(
  PickType(Feed, ['content', 'createBy']),
  UploadFilesDto,
) {
  @IsNotEmpty()
  declare content: string;

  declare public?: boolean;
}
