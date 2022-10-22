import { Body, Controller, Delete, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { PostService } from '@/modules/post/post.service';
import { JwtAuthGuard } from '@/common/decorator';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';
import type { DeletePostDto } from '@/modules/post/dto/delete-post.dto';
import { PublishNewPostDto } from '@/modules/post/dto/publish-new-post.dto';
import { UpdatePostDto } from '@/modules/post/dto/update-post.dto';
import { AccessInterceptor } from '@/common/interceptor/access.interceptor';

@Controller('post')
@JwtAuthGuard()
@UseInterceptors(AccessInterceptor)
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  createPost(@Body() draft: PublishNewPostDto, @UserFromAuth(['id']) user: User) {
    draft.createBy = user;
    return this.postService.publishPost(draft);
  }

  @Put()
  updatePost(@Body() draft: UpdatePostDto, @UserFromAuth(['id']) user: User) {
    draft.updateBy = user;
    return this.postService.publishPost(draft);
  }

  @Delete(':id')
  deletePost(@Param('id') id: DeletePostDto['id'], @UserFromAuth(['id']) user: User) {
    return this.postService.deletePost({
      id,
      createBy: user,
    });
  }
}
