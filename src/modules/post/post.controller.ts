import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { PostService } from '@/modules/post/post.service';
import { AccessAuthGuard } from '@/common/decorator/auth-guard';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';
import { SpecificPostDto } from '@/modules/post/dto/specific-post.dto';
import { CreatePostDto } from '@/modules/post/dto/create-post.dto';
import { PatchPostDto } from '@/modules/post/dto/patch-post.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('post')
@ApiTags('post')
@AccessAuthGuard()
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  createPost(@Body() draft: CreatePostDto, @UserFromAuth(['id']) user: User) {
    draft.createBy = user;
    return this.postService.createPost(draft);
  }

  @Patch(':id')
  updatePost(
    @Param() { id }: SpecificPostDto,
    @Body() draft: PatchPostDto,
    @UserFromAuth(['id']) user: User,
  ) {
    draft.updateBy = user;
    draft.id = id;
    return this.postService.updatePost(draft);
  }

  @Delete(':id')
  deletePost(@Param() { id }: SpecificPostDto, @UserFromAuth(['id']) user: User) {
    return this.postService.deletePost({
      id,
      createBy: user,
    });
  }
}
