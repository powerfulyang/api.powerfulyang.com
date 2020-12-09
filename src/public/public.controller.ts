import { Controller, Get, Param } from '@nestjs/common';
import { PostService } from '@/modules/post/post.service';
import { PathViewCount } from '@/common/decorator/path-view-count.decorator';
import { Posts } from '@/entity/posts.entity';
import { AppLogger } from '@/common/logger/app.logger';

@Controller('public')
export class PublicController {
  constructor(private postService: PostService, private logger: AppLogger) {
    this.logger.setContext(PublicController.name);
  }

  @Get('hello')
  hello() {
    return 'Hello World!!!';
  }

  @Get('posts')
  @PathViewCount()
  posts() {
    return this.postService.publicList();
  }

  @Get('posts/:id')
  @PathViewCount()
  post(@Param() post: Posts) {
    return this.postService.publicRead(post);
  }
}
