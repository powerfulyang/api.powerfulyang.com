import { Controller, Get, Param } from '@nestjs/common';
import { Posts } from '@/entity/posts.entity';
import { AppLogger } from '@/common/logger/app.logger';
import { PublicService } from '@/public/public.service';
import { Pagination } from '@/common/decorator/pagination.decorator';
import { AssetService } from '@/modules/asset/asset.service';

@Controller()
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

  @Get('posts')
  posts() {
    return this.publicService.getAllPublicPosts();
  }

  @Get('posts/tags')
  tags() {
    return this.publicService.postsTags();
  }

  @Get('posts/:id')
  post(@Param() post: Posts) {
    return this.publicService.getPublicPostById(post);
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
