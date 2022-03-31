import { Controller, Get, Param, Query } from '@nestjs/common';
import { pluck } from 'ramda';
import { Post } from '@/modules/post/entities/post.entity';
import { AppLogger } from '@/common/logger/app.logger';
import { Pagination } from '@/common/decorator/pagination.decorator';
import { AssetService } from '@/modules/asset/asset.service';
import { PostService } from '@/modules/post/post.service';
import { FeedService } from '@/modules/feed/feed.service';
import { PublicAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { FamilyMembersFromAuth } from '@/common/decorator/user-from-auth.decorator';
import type { User } from '@/modules/user/entities/user.entity';
import type { Asset } from '@/modules/asset/entities/asset.entity';

@Controller('public')
@PublicAuthGuard()
export class PublicController {
  constructor(
    private readonly logger: AppLogger,
    private readonly assetService: AssetService,
    private readonly postService: PostService,
    private readonly feedService: FeedService,
  ) {
    this.logger.setContext(PublicController.name);
  }

  @Get('hello')
  hello() {
    this.logger.info('Hello world');
    return 'Hello World!!!';
  }

  @Get('post')
  getPosts(@FamilyMembersFromAuth() users: User[], @Query() post: Post) {
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
    @Query('id') id: string,
    @FamilyMembersFromAuth() users: User[],
    @Query('size') size: string = '20',
  ) {
    return this.feedService.infiniteQuery(+id, Number(size), pluck('id', users));
  }

  @Get('asset')
  assets(@Pagination() pagination: Pagination, @FamilyMembersFromAuth() users: User[]) {
    return this.assetService.getAssets(pagination, pluck('id', users));
  }

  @Get('asset/infiniteQuery')
  infiniteQuery(
    @Query('id') id: Asset['id'],
    @FamilyMembersFromAuth() users: User[],
    @Query('size') size: string = '20',
  ) {
    return this.assetService.infiniteQuery(id, Number(size), pluck('id', users));
  }

  @Get('asset/:id')
  getAssetById(@Param('id') id: string, @FamilyMembersFromAuth() users: User[]) {
    return this.assetService.getAccessAssetById(+id, pluck('id', users));
  }
}
