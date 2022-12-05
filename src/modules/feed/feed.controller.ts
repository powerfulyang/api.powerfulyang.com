import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';
import type { UploadFile } from '@/type/UploadFile';
import { AccessAuthGuard } from '@/common/decorator/auth-guard';
import { SpecificFeedDto } from '@/modules/feed/dto/specific-feed.dto';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkInterceptorResultResponse } from '@/common/swagger/ResponseInterceptorResult';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { Feed } from './entities/feed.entity';

@Controller('feed')
@ApiTags('feed')
@AccessAuthGuard()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a feed',
    operationId: 'createFeed',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkInterceptorResultResponse({
    model: Feed,
  })
  create(
    @Body() createFeedDto: CreateFeedDto,
    @UserFromAuth(['id']) user: User,
    @Body('assets') assets: UploadFile[],
  ) {
    const { content, public: isPublic } = createFeedDto;
    return this.feedService.postFeed({
      content,
      createBy: user,
      public: Object.is(isPublic, 'true'),
      assets,
    });
  }

  @Put()
  @ApiOperation({
    summary: 'Update a feed',
    operationId: 'updateFeed',
  })
  @ApiConsumes('multipart/form-data')
  update(
    @Body() updateFeedDto: UpdateFeedDto,
    @UserFromAuth(['id']) user: User,
    @Body('assets') assets: UploadFile[],
  ) {
    const { id, content, public: isPublic } = updateFeedDto;
    return this.feedService.modifyFeed({
      id,
      content,
      updateBy: user,
      public: Object.is(isPublic, 'true'),
      assets,
    });
  }

  @Delete(':id')
  remove(@Param() { id }: SpecificFeedDto, @UserFromAuth(['id']) user: User) {
    return this.feedService.deleteFeed({
      id,
      createBy: user,
    });
  }
}
