import { Body, Controller, Delete, Param, Post as PostDecorator } from '@nestjs/common';
import { PostService } from '@/modules/post/post.service';
import { AdminAuthGuard, JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User, UserForeignKey } from '@/modules/user/entities/user.entity';
import type { Post } from '@/modules/post/entities/post.entity';
import { CreatePostDto } from '@/modules/user/dto/create-post.dto';

@Controller('post')
@JwtAuthGuard()
export class PostController {
  constructor(private postService: PostService) {}

  @PostDecorator()
  @AdminAuthGuard()
  createPost(@Body() draft: CreatePostDto, @UserFromAuth(['id']) user: User) {
    draft.createBy = user;
    return this.postService.publishPost(draft);
  }

  @Delete(':id')
  @AdminAuthGuard()
  deletePost(@Param('id') id: Post['id'], @UserFromAuth(['id']) user: UserForeignKey) {
    return this.postService.deletePost({
      id,
      createBy: user,
    });
  }
}
