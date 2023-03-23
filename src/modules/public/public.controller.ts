import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import { AssetService } from '@/modules/asset/asset.service';
import { PostService } from '@/modules/post/post.service';
import { FeedService } from '@/modules/feed/feed.service';
import { JwtAuthGuard, PublicAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { AuthFamilyMembersId, AuthUser } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';
import { SearchPostDto } from '@/modules/post/dto/search-post.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatGptService } from '@app/chat-gpt';
import { PathViewCountService } from '@/modules/path-view-count/path-view-count.service';
import { ClientTimezone } from '@/common/decorator/client-timezone';
import { BingAIPayload } from '@/payload/BingAIPayload';
import { ChatGPTPayload } from '@/payload/ChatGPTPayload';
import { ApiOkInfiniteQueryResponse } from '@/common/swagger/ApiOkInfiniteQueryResponse';
import { Feed } from '@/modules/feed/entities/feed.entity';
import { InfiniteQueryRequest } from '@/common/request/InfiniteQueryRequest';
import { Asset } from '@/modules/asset/entities/asset.entity';

@Controller('public')
@PublicAuthGuard()
@ApiTags('public-api')
export class PublicController {
  constructor(
    private readonly logger: LoggerService,
    private readonly assetService: AssetService,
    private readonly postService: PostService,
    private readonly feedService: FeedService,
    private readonly chatGptService: ChatGptService,
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
  queryPublicPosts(@AuthFamilyMembersId() userIds: User['id'][], @Query() post: SearchPostDto) {
    return this.postService.searchPosts(post, userIds);
  }

  @Get('post/years')
  @ApiOperation({
    summary: '获取所有的公开文章的年份列表',
    operationId: 'queryPublicPostYears',
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

  @Post('/chat-gpt/chat')
  @JwtAuthGuard()
  @ApiOperation({
    summary: '与chat gpt聊天',
    operationId: 'chatWithChatGPT',
  })
  chatWithChatGPT(@Body() body: ChatGPTPayload): Promise<ChatGPTPayload> {
    return this.chatGptService.sendMessage(body.message, {
      parentMessageId: body.parentMessageId,
      conversationId: body.conversationId,
    });
  }

  @Post('/bing-ai/chat')
  @JwtAuthGuard()
  @ApiOperation({
    summary: '与bing ai聊天',
    operationId: 'chatWithBingAI',
  })
  chatWithBingAI(
    @Body()
    body: BingAIPayload,
  ): Promise<BingAIPayload> {
    return this.chatGptService.sendMessageWithBingAI(body.message, {
      conversationSignature: body.conversationSignature,
      conversationId: body.conversationId,
      clientId: body.clientId,
      invocationId: body.invocationId,
    });
  }

  @Get('view-count')
  viewCount(@ClientTimezone() timezone: string) {
    return this.pathViewCountService.viewCount(timezone);
  }
}
