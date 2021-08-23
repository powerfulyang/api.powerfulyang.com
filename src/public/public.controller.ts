import { Controller, Get, Param } from '@nestjs/common';
import { Post } from '@/entity/post.entity';
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
  AllPublicPost() {
    return this.publicService.getAllPublicPost();
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

  @Get('gallery')
  gallery(@Pagination() pagination: Pagination) {
    return this.assetService.list(pagination);
  }

  @Get('common-node')
  isCommonNode() {
    return this.publicService.isCommonNode();
  }
}
