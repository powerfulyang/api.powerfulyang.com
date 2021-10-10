import { Controller, Get, Param, Query } from '@nestjs/common';
import { Post } from '@/modules/post/entities/post.entity';
import { AppLogger } from '@/common/logger/app.logger';
import { PublicService } from '@/public/public.service';
import { Pagination } from '@/common/decorator/pagination.decorator';
import { AssetService } from '@/modules/asset/asset.service';
import { PostService } from '@/modules/post/post.service';
import { FeedService } from '@/modules/feed/feed.service';

@Controller('public')
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
    return 'Hello World!!!';
  }

  @Get('post')
  AllPublicPost(@Query() query: Post) {
    return this.postService.getPosts(query);
  }

  @Get('post/years')
  getPostPublishedYears() {
    return this.postService.getPublishedYears();
  }

  @Get('post/tags')
  tags() {
    return this.postService.getPublishedTags();
  }

  @Get('post/:id')
  post(@Param() post: Post) {
    return this.postService.readPost(post);
  }

  @Get('feed')
  AllPublicFeed() {
    return this.feedService.feeds();
  }

  @Get('asset')
  gallery(@Pagination() pagination: Pagination) {
    return this.assetService.getAssets(pagination);
  }

  @Get('asset/:id')
  getAssetById(@Param('id') id: string) {
    return this.assetService.getAssetById(+id);
  }

  @Get('common-node')
  isCommonNode() {
    return this.publicService.isCommonNode();
  }
}
