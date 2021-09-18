import { Controller, Get, Param, Query } from '@nestjs/common';
import { Post } from '@/modules/post/entities/post.entity';
import { AppLogger } from '@/common/logger/app.logger';
import { PublicService } from '@/public/public.service';
import { Pagination } from '@/common/decorator/pagination.decorator';
import { AssetService } from '@/modules/asset/asset.service';

@Controller('public')
export class PublicController {
  constructor(
    private publicService: PublicService,
    private logger: AppLogger,
    private assetService: AssetService,
  ) {
    this.logger.setContext(PublicController.name);
  }

  @Get('hello')
  hello() {
    return 'Hello World!!!';
  }

  @Get('post')
  AllPublicPost(@Query() query: Post) {
    return this.publicService.getAllPublicPost(query);
  }

  @Get('post/years')
  getPostPublishedYears() {
    return this.publicService.getPublishedYears();
  }

  @Get('post/tags')
  tags() {
    return this.publicService.getPublicPostTags();
  }

  @Get('post/:id')
  post(@Param() post: Post) {
    return this.publicService.getPublicPostById(post);
  }

  @Get('feed')
  AllPublicFeed() {
    return this.publicService.getAllPublicFeed();
  }

  @Get('asset')
  gallery(@Pagination() pagination: Pagination) {
    return this.assetService.publicList(pagination);
  }

  @Get('asset/:id')
  getAssetById(@Param('id') id: string) {
    return this.assetService.getPublicAssetById(+id);
  }

  @Get('common-node')
  isCommonNode() {
    return this.publicService.isCommonNode();
  }
}
