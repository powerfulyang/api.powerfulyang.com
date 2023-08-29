import { Controller, Get, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssetService } from '@/asset/asset.service';
import { Asset } from '@/asset/entities/asset.entity';
import { PublicAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { ClientTimezone } from '@/common/decorator/client-timezone';
import { AuthFamilyMembersId, AuthUser } from '@/common/decorator/user-from-auth.decorator';
import { LoggerService } from '@/common/logger/logger.service';
import { InfiniteQueryRequest } from '@/type/InfiniteQueryRequest';
import { ApiOkInfiniteQueryResponse } from '@/common/swagger/ApiOkInfiniteQueryResponse';
import { Feed } from '@/feed/entities/feed.entity';
import { FeedService } from '@/feed/feed.service';
import { PathViewCountService } from '@/path-view-count/path-view-count.service';
import { SearchPostDto } from '@/post/dto/search-post.dto';
import { Post as _Post } from '@/post/entities/post.entity';
import { PostService } from '@/post/post.service';
import { User } from '@/user/entities/user.entity';

@Controller('public')
@PublicAuthGuard()
@ApiTags('open')
export class PublicController {
  constructor(
    private readonly logger: LoggerService,
    private readonly assetService: AssetService,
    private readonly postService: PostService,
    private readonly feedService: FeedService,
    private readonly pathViewCountService: PathViewCountService,
  ) {
    this.logger.setContext(PublicController.name);
  }

  @Get('hello')
  @ApiOperation({
    summary: 'hello ping',
    operationId: 'hello',
  })
  hello(@AuthUser() user: User): string {
    return `Hello, ${user.nickname || 'unauthorized visitor'}!`;
  }

  @Get('post')
  @ApiOperation({
    summary: '获取所有的公开文章列表',
    operationId: 'queryPublicPosts',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => [Post],
  })
  queryPublicPosts(@AuthFamilyMembersId() userIds: User['id'][], @Query() post: SearchPostDto) {
    return this.postService.searchPosts(post, userIds);
  }

  @Get('post/years')
  @ApiOperation({
    summary: '获取所有的公开文章的年份列表',
    operationId: 'queryPublicPostYears',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          publishYear: {
            type: 'number',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
        required: ['publishYear', 'updatedAt'],
      },
    },
  })
  queryPublicPostYears(@AuthFamilyMembersId() userIds: User['id'][]) {
    return this.postService.queryPublishedYears(userIds);
  }

  @Get('post/tags')
  @ApiOperation({
    summary: '获取所有的公开文章的标签列表',
    operationId: 'queryPublicPostTags',
  })
  queryPublicPostTags(@AuthFamilyMembersId() userIds: User['id'][]) {
    return this.postService.queryPublishedTags(userIds);
  }

  @Get('post/:id')
  @ApiOperation({
    summary: '获取单个文章详细信息',
    operationId: 'queryPublicPostById',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: _Post,
  })
  queryPublicPostById(
    @Param('id') id: number,
    @AuthFamilyMembersId() userIds: User['id'][],
    @Query('versions') versions: string[] = [],
  ) {
    return this.postService.readPost(id, userIds, versions);
  }

  @Get('feed')
  @ApiOperation({
    summary: '获取所有的公开时间线',
    operationId: 'infiniteQueryPublicTimeline',
  })
  @ApiOkInfiniteQueryResponse({
    model: Feed,
  })
  infiniteQueryPublicTimeline(
    @Query() query: InfiniteQueryRequest,
    @AuthFamilyMembersId() userIds: User['id'][],
  ) {
    return this.feedService.infiniteQuery({
      userIds,
      ...query,
    });
  }

  @Get('asset')
  @ApiOperation({
    summary: '获取公开的图片资源',
    operationId: 'infiniteQueryPublicAsset',
  })
  @ApiOkInfiniteQueryResponse({
    model: Asset,
  })
  infiniteQueryPublicAsset(
    @Query() query: InfiniteQueryRequest,
    @AuthFamilyMembersId() userIds: User['id'][],
  ) {
    return this.assetService.infiniteQuery({
      userIds,
      ...query,
    });
  }

  @Get('asset/:id')
  @ApiOperation({
    summary: '获取单个公开的图片资源',
    operationId: 'queryPublicAssetById',
  })
  getPublicAssetById(@Param('id') id: string, @AuthFamilyMembersId() userIds: User['id'][]) {
    return this.assetService.getAccessAssetById(+id, userIds);
  }

  @Get('view-count')
  viewCount(@ClientTimezone() timezone: string) {
    return this.pathViewCountService.viewCount(timezone);
  }
}
