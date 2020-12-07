import { Controller, Get, Param } from '@nestjs/common';
import { PostService } from '@/modules/post/post.service';
import { Posts } from '@/entity/posts.entity';
import { PathViewCount } from '@/common/decorator/path-view-count.decorator';

@Controller()
export class CoreController {
  constructor(private postService: PostService) {}

  @Get('hello')
  hello() {
    return 'Hello World!!!';
  }

  @Get('posts')
  @PathViewCount()
  posts() {
    return this.postService.postDao.find({
      select: ['id', 'title', 'createAt'],
      order: { id: 'DESC' },
    });
  }

  @Get('posts/:id')
  @PathViewCount()
  post(@Param() post: Posts) {
    return this.postService.get(post);
  }
}
