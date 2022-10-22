import { Body, Controller, Delete, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';
import type { UploadFile } from '@/type/UploadFile';
import type { Feed } from '@/modules/feed/entities/feed.entity';
import { AccessInterceptor } from '@/common/interceptor/access.interceptor';
import { JwtAuthGuard } from '@/common/decorator';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Controller('feed')
@JwtAuthGuard()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  @UseInterceptors(AccessInterceptor)
  create(
    @Body() createFeedDto: CreateFeedDto,
    @UserFromAuth(['id']) user: User,
    @Body('assets') assets: UploadFile[],
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
  @UseInterceptors(AccessInterceptor)
  update(
    @Body() updateFeedDto: UpdateFeedDto,
    @UserFromAuth(['id']) user: User,
    @Body('assets') assets: UploadFile[],
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

  @Delete(':id')
  remove(@Param('id') id: Feed['id'], @UserFromAuth(['id']) user: User) {
    return this.feedService.deleteFeed({
      id,
      createBy: user,
    });
  }
}
