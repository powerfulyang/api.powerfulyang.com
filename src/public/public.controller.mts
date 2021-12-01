import { Controller, Get, Param, Query } from '@nestjs/common';
import { pluck } from 'ramda';
import { Post } from '@/modules/post/entities/post.entity.mjs';
import { AppLogger } from '@/common/logger/app.logger.mjs';
import { PublicService } from '@/public/public.service.mjs';
import { Pagination } from '@/common/decorator/pagination.decorator.mjs';
import { AssetService } from '@/modules/asset/asset.service.mjs';
import { PostService } from '@/modules/post/post.service.mjs';
import { FeedService } from '@/modules/feed/feed.service.mjs';
import { PublicAuthGuard } from '@/common/decorator/auth-guard.decorator.mjs';
import { FamilyMembersFromAuth } from '@/common/decorator/user-from-auth.decorator.mjs';
import type { User } from '@/modules/user/entities/user.entity.mjs';
import type { Asset } from '@/modules/asset/entities/asset.entity.mjs';

@Controller('public')
@PublicAuthGuard()
export class PublicController {
  constructor(
    private readonly publicService: PublicService,
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
    return this.postService.getPosts(post, pluck('id', users));
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
  readPost(@Param() post: Post, @FamilyMembersFromAuth() users: User[]) {
    return this.postService.readPost(post, pluck('id', users));
  }

  @Get('feed')
  feeds(@FamilyMembersFromAuth() users: User[]) {
    return this.feedService.feeds(pluck('id', users));
  }

  @Get('asset')
  assets(@Pagination() pagination: Pagination, @FamilyMembersFromAuth() users: User[]) {
    return this.assetService.getAssets(pagination, pluck('id', users));
  }

  @Get('asset/infiniteQuery')
  infiniteQuery(
    @Query('id') id: Asset['id'],
    @Query('size') size: string = '20',
    @FamilyMembersFromAuth() users: User[],
  ) {
    return this.assetService.infiniteQuery(id, size, pluck('id', users));
  }

  @Get('asset/:id')
  getAssetById(@Param('id') id: string, @FamilyMembersFromAuth() users: User[]) {
    return this.assetService.getAssetById(+id, pluck('id', users));
  }

  @Get('common-node')
  isCommonNode() {
    return this.publicService.isCommonNode();
  }
}
