import { Controller, Get, Param, Query } from '@nestjs/common';
import { pluck } from 'ramda';
import { LoggerService } from '@/common/logger/logger.service';
import { AssetService } from '@/modules/asset/asset.service';
import { PostService } from '@/modules/post/post.service';
import { FeedService } from '@/modules/feed/feed.service';
import { PublicAuthGuard } from '@/common/decorator';
import { FamilyMembersFromAuth } from '@/common/decorator/user-from-auth.decorator';
import type { User } from '@/modules/user/entities/user.entity';
import { SearchPostDto } from '@/modules/post/dto/search-post.dto';

@Controller('public')
@PublicAuthGuard()
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
  hello() {
    return 'Hello World!!!';
  }

  @Get('post')
  getPosts(@FamilyMembersFromAuth() users: User[], @Query() post: SearchPostDto) {
    return this.postService.queryPosts(post, pluck('id', users));
  }

  @Get('post/years')
  getPublishedYears(@FamilyMembersFromAuth() users: User[]) {
    return this.postService.getPublishedYears(pluck('id', users));
  }

  @Get('post/tags')
  getPublishedTags(@FamilyMembersFromAuth() users: User[]) {
    return this.postService.getPublishedTags(pluck('id', users));
  }

  @Get('post/:id')
  readPost(@Param('id') id: string, @FamilyMembersFromAuth() users: User[]) {
    return this.postService.readPost(+id, pluck('id', users));
  }

  @Get('feed')
  feeds(
    @Query('cursor') cursor: string,
    @FamilyMembersFromAuth() users: User[],
    @Query('size') size: string = '20',
  ) {
    return this.feedService.infiniteQuery(cursor, Number(size), pluck('id', users));
  }

  @Get('asset')
  infiniteQuery(
    @Query('cursor') cursor: string,
    @FamilyMembersFromAuth() users: User[],
    @Query('size') size: string = '20',
  ) {
    return this.assetService.infiniteQuery(cursor, Number(size), pluck('id', users));
  }

  @Get('asset/:id')
  getAssetById(@Param('id') id: string, @FamilyMembersFromAuth() users: User[]) {
    return this.assetService.getAccessAssetById(+id, pluck('id', users));
  }
}
