import { Body, Controller, Param, Patch, Post, UploadedFiles } from '@nestjs/common';
import { AdminAuthGuard, JwtAuthGuard } from '@/common/decorator';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';
import { ImagesInterceptor } from '@/common/interceptor/images.file.upload.interceptor';
import type { UploadFile } from '@/type/UploadFile';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Controller('feed')
@AdminAuthGuard()
@JwtAuthGuard()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  @ImagesInterceptor('assets')
  create(
    @Body() createFeedDto: CreateFeedDto,
    @UserFromAuth(['id']) user: User,
    @UploadedFiles() assets: UploadFile[],
  ) {
    // 因为是 FormData 格式, 只能传 string
    const isPublic = Object.is(createFeedDto.public, 'true');
    return this.feedService.postNewFeed(
      {
        ...createFeedDto,
        createBy: user,
        public: isPublic,
      },
      assets,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeedDto: UpdateFeedDto) {
    return this.feedService.updateFeed(+id, updateFeedDto);
  }
}
