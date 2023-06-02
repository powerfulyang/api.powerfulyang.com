import { AccessAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { AuthUser } from '@/common/decorator/user-from-auth.decorator';
import { LoggerService } from '@/common/logger/logger.service';
import { CreatePostDto } from '@/post/dto/create-post.dto';
import { PatchPostDto } from '@/post/dto/patch-post.dto';
import { PostService } from '@/post/post.service';
import { User } from '@/user/entities/user.entity';
import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Post as _Post } from './entities/post.entity';

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
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: _Post,
  })
  createPost(@Body() draft: CreatePostDto, @AuthUser(['id']) user: User) {
    draft.createBy = user;
    return this.postService.createPost(draft);
  }

  @Patch()
  @ApiOperation({
    summary: '更新文章',
    operationId: 'updatePost',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: _Post,
  })
  updatePost(@Body() draft: PatchPostDto, @AuthUser(['id']) user: User) {
    draft.updateBy = user;
    return this.postService.updatePost(draft);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '删除文章',
    operationId: 'deletePost',
  })
  deletePost(@Param('id') id: number, @AuthUser(['id']) user: User) {
    return this.postService.deletePost({
      id,
      createBy: user,
    });
  }
}
