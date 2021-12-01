import { Body, Controller, Delete, Param, Post as PostDecorator } from '@nestjs/common';
import { PostService } from '@/modules/post/post.service.mjs';
import { AdminAuthGuard, JwtAuthGuard } from '@/common/decorator/auth-guard.decorator.mjs';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator.mjs';
import { User } from '@/modules/user/entities/user.entity.mjs';
import { PostDto } from '@/modules/user/dto/PostDto.mjs';
import { Post } from '@/modules/post/entities/post.entity.mjs';

@Controller('post')
@JwtAuthGuard()
export class PostController {
  constructor(private postService: PostService) {}

  @PostDecorator()
  createPost(@Body() draft: PostDto, @UserFromAuth(['id']) user: User) {
    draft.createBy = user;
    return this.postService.publishPost(draft);
  }

  @Delete(':id')
  @AdminAuthGuard()
  deletePost(@Param() draft: Post, @UserFromAuth(['id']) user: User) {
    draft.createBy = user;
    return this.postService.deletePost(draft);
  }
}
