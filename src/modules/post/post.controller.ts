import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { PostService } from '@/modules/post/post.service';
import { AdminAuthGuard, JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/entity/user.entity';
import { PostDto } from '@/entity/dto/PostDto';
import { Posts } from '@/entity/posts.entity';

@Controller('post')
@JwtAuthGuard()
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @AdminAuthGuard()
  createPost(@Body() draft: PostDto, @UserFromAuth(['id']) user: User) {
    draft.user = user;
    return this.postService.createPost(draft);
  }

  @Get()
  getAll(@UserFromAuth(['id']) user: User, @Query() draft: Posts) {
    draft.user = user;
    return this.postService.getAll(draft);
  }

  @Get(':id')
  get(@Param() draft: Posts, @UserFromAuth(['id']) user: User) {
    draft.user = user;
    return this.postService.get(draft);
  }

  @Delete(':id')
  deletePost(@Param() draft: Posts, @UserFromAuth(['id']) user: User) {
    draft.user = user;
    return this.postService.deletePost(draft);
  }
}
