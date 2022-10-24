import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';
import type { UploadFile } from '@/type/UploadFile';
import { AccessAuthGuard } from '@/common/decorator';
import { DeleteFeedDto } from '@/modules/feed/dto/delete-feed.dto';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Controller('feed')
@AccessAuthGuard()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  create(
    @Body() createFeedDto: CreateFeedDto,
    @UserFromAuth(['id']) user: User,
    @Body('assets') assets: UploadFile[],
  ) {
    const { content, public: isPublic } = createFeedDto;
    return this.feedService.postFeed(
      {
        content,
        createBy: user,
        public: Object.is(isPublic, 'true'),
      },
      assets,
    );
  }

  @Put()
  update(
    @Body() updateFeedDto: UpdateFeedDto,
    @UserFromAuth(['id']) user: User,
    @Body('assets') assets: UploadFile[],
  ) {
    const { id, content, public: isPublic } = updateFeedDto;
    return this.feedService.modifyFeed(
      {
        id,
        content,
        updateBy: user,
        public: Object.is(isPublic, 'true'),
      },
      assets,
    );
  }

  @Delete(':id')
  remove(@Param() { id }: DeleteFeedDto, @UserFromAuth(['id']) user: User) {
    return this.feedService.deleteFeed({
      id,
      createBy: user,
    });
  }
}
