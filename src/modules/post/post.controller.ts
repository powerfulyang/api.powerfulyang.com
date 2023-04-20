import { AccessAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { AuthUser } from '@/common/decorator/user-from-auth.decorator';
import { LoggerService } from '@/common/logger/logger.service';
import { CreatePostDto } from '@/modules/post/dto/create-post.dto';
import { PatchPostDto } from '@/modules/post/dto/patch-post.dto';
import { SpecificPostDto } from '@/modules/post/dto/specific-post.dto';
import { PostService } from '@/modules/post/post.service';
import { User } from '@/modules/user/entities/user.entity';
import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('post')
@ApiTags('post')
@AccessAuthGuard()
export class PostController {
  constructor(private readonly postService: PostService, private readonly logger: LoggerService) {
    this.logger.setContext(PostController.name);
  }

  @Post()
  @ApiOperation({
    summary: '创建文章',
    operationId: 'createPost',
  })
  createPost(@Body() draft: CreatePostDto, @AuthUser(['id']) user: User) {
    draft.createBy = user;
    return this.postService.createPost(draft);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '更新文章',
    operationId: 'updatePost',
  })
  updatePost(
    @Param() { id }: SpecificPostDto,
    @Body() draft: PatchPostDto,
    @AuthUser(['id']) user: User,
  ) {
    draft.updateBy = user;
    draft.id = id;
    return this.postService.updatePost(draft);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '删除文章',
    operationId: 'deletePost',
  })
  deletePost(@Param() { id }: SpecificPostDto, @AuthUser(['id']) user: User) {
    return this.postService.deletePost({
      id,
      createBy: user,
    });
  }
}
