import { Controller, Get, Param, Query } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import { AssetService } from '@/modules/asset/asset.service';
import { PostService } from '@/modules/post/post.service';
import { FeedService } from '@/modules/feed/feed.service';
import { PublicAuthGuard } from '@/common/decorator/auth-guard';
import { FamilyMembersIdFromAuth, UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';
import { SearchPostDto } from '@/modules/post/dto/search-post.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('public')
@PublicAuthGuard()
@ApiTags('public-api')
export class PublicController {
  constructor(
    private readonly logger: LoggerService,
    private readonly assetService: AssetService,
    private readonly postService: PostService,
    private readonly feedService: FeedService,
  ) {
    this.logger.setContext(PublicController.name);
  }

  @Get('hello')
  hello(@UserFromAuth() user: User): string {
    return `Hello, ${user.nickname || 'unauthorized visitor'}!`;
  }

  @Get('post')
  getPosts(@FamilyMembersIdFromAuth() userIds: User['id'][], @Query() post: SearchPostDto) {
    return this.postService.queryPosts(post, userIds);
  }

  @Get('post/search')
  searchPosts(@Query('content') content: string) {
    return this.postService.searchPostByContent(content);
  }

  @Get('post/years')
  getPublishedYears(@FamilyMembersIdFromAuth() userIds: User['id'][]) {
    return this.postService.getPublishedYears(userIds);
  }

  @Get('post/tags')
  getPublishedTags(@FamilyMembersIdFromAuth() userIds: User['id'][]) {
    return this.postService.getPublishedTags(userIds);
  }

  @Get('post/:id')
  readPost(@Param('id') idOrTitle: string, @FamilyMembersIdFromAuth() userIds: User['id'][]) {
    return this.postService.readPost(idOrTitle, userIds);
  }

  @Get('feed')
  feeds(
    @Query('prevCursor') prevCursor: string,
    @Query('nextCursor') nextCursor: string,
    @Query('take') take: string,
    @FamilyMembersIdFromAuth() userIds: User['id'][],
  ) {
    return this.feedService.infiniteQuery({
      prevCursor,
      nextCursor,
      userIds,
      take,
    });
  }

  @Get('asset')
  infiniteQuery(
    @Query('prevCursor') prevCursor: string,
    @Query('nextCursor') nextCursor: string,
    @Query('take') take: string,
    @FamilyMembersIdFromAuth() userIds: User['id'][],
  ) {
    return this.assetService.infiniteQuery({
      prevCursor,
      nextCursor,
      userIds,
      take,
    });
  }

  @Get('asset/:id')
  getAssetById(@Param('id') id: string, @FamilyMembersIdFromAuth() userIds: User['id'][]) {
    return this.assetService.getAccessAssetById(+id, userIds);
  }
}
