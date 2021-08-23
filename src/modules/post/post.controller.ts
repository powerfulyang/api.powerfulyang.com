import { Body, Controller, Delete, Get, Param, Post as PostDecorator, Query } from '@nestjs/common';
import { PostService } from '@/modules/post/post.service';
import { JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/entity/user.entity';
import { PostDto } from '@/entity/dto/PostDto';
import { Post } from '@/entity/post.entity';

@Controller('post')
@JwtAuthGuard()
export class PostController {
  constructor(private postService: PostService) {}

  @PostDecorator()
  createPost(@Body() draft: PostDto, @UserFromAuth(['id']) user: User) {
    draft.createBy = user;
    return this.postService.createPost(draft);
  }

  @Get()
  getAll(@UserFromAuth(['id']) user: User, @Query() draft: Post) {
    draft.createBy = user;
    return this.postService.getAll(draft);
  }

  @Get(':id')
  get(@Param() draft: Post, @UserFromAuth(['id']) user: User) {
    draft.createBy = user;
    return this.postService.get(draft);
  }

  @Delete(':id')
  deletePost(@Param() draft: Post, @UserFromAuth(['id']) user: User) {
    draft.createBy = user;
    return this.postService.deletePost(draft);
  }
}
