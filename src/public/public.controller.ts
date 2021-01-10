import { Controller, Get, Param } from '@nestjs/common';
import { PathViewCount } from '@/common/decorator/path-view-count.decorator';
import { Posts } from '@/entity/posts.entity';
import { AppLogger } from '@/common/logger/app.logger';
import { PublicService } from '@/public/public.service';

@Controller()
export class PublicController {
  constructor(private publicService: PublicService, private logger: AppLogger) {
    this.logger.setContext(PublicController.name);
  }

  @Get('hello')
  hello() {
    return 'Hello World!!!';
  }

  @Get('posts')
  @PathViewCount()
  posts() {
    return this.publicService.getAllPublicPosts();
  }

  @Get('posts/tags')
  tags() {
    return this.publicService.postsTags();
  }

  @Get('posts/:id')
  @PathViewCount()
  post(@Param() post: Posts) {
    return this.publicService.getPublicPostById(post);
  }
}
