import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { PostService } from '@/modules/post/post.service';
import { AdminAuthGuard } from '@/common/decorator';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';
import type { DeletePostDto } from '@/modules/post/dto/delete-post.dto';
import { PublishPostDto } from '@/modules/post/dto/publish-post.dto';

@Controller('post')
@AdminAuthGuard()
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  createPost(@Body() draft: PublishPostDto, @UserFromAuth(['id']) user: User) {
    draft.createBy = user;
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
