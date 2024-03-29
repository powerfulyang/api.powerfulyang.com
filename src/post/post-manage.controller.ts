import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { BodyPagination } from '@/common/decorator/pagination/pagination.decorator';
import { LoggerService } from '@/common/logger/logger.service';
import { QueryPostsDto } from '@/post/dto/query-posts.dto';
import { PostService } from '@/post/post.service';

@Controller('post-manage')
@ApiTags('post-manage')
@AdminAuthGuard()
export class PostManageController {
  constructor(
    private readonly logger: LoggerService,
    private readonly postService: PostService,
  ) {
    this.logger.setContext(PostManageController.name);
  }

  @Post('query-posts')
  @ApiOperation({
    summary: '分页查询日志',
    operationId: 'queryPosts',
  })
  queryPosts(@BodyPagination() paginateQueryPostDto: QueryPostsDto) {
    return this.postService.queryPosts(paginateQueryPostDto);
  }
}
