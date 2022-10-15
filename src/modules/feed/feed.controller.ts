import { Body, Controller, Delete, Post, Put, UseInterceptors } from '@nestjs/common';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';
import { Images, ImagesInterceptor } from '@/common/interceptor/images.file.upload.interceptor';
import type { UploadFile } from '@/type/UploadFile';
import { AdminAuthGuard } from '@/common/decorator';
import type { Feed } from '@/modules/feed/entities/feed.entity';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Controller('feed')
@AdminAuthGuard()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  @UseInterceptors(ImagesInterceptor)
  create(
    @Body() createFeedDto: CreateFeedDto,
    @UserFromAuth(['id']) user: User,
    @Images() assets: UploadFile[],
  ) {
    // 因为是 FormData 格式, 只能传 string
    const isPublic = Object.is(createFeedDto.public, 'true');
    return this.feedService.postFeed(
      {
        ...createFeedDto,
        createBy: user,
        public: isPublic,
      },
      assets,
    );
  }

  @Put()
  @UseInterceptors(ImagesInterceptor)
  update(
    @Body() updateFeedDto: UpdateFeedDto,
    @UserFromAuth(['id']) user: User,
    @Images() assets: UploadFile[],
  ) {
    // 因为是 FormData 格式, 只能传 string
    const isPublic = Object.is(updateFeedDto.public, 'true');
    return this.feedService.modifyFeed(
      {
        ...updateFeedDto,
        updateBy: user,
        public: isPublic,
      },
      assets,
    );
  }

  @Delete()
  remove(@Body('id') id: Feed['id']) {
    return this.feedService.deleteFeed(id);
  }
}
