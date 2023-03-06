import { LoggerService } from '@/common/logger/logger.service';
import { PostService } from '@/modules/post/post.service';
import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { PaginateQueryPostDto } from '@/modules/post/dto/paginate-query-post.dto';
import { Pagination } from '@/common/decorator/pagination/pagination.decorator';

@Controller('post-manage')
@ApiTags('post-manage')
@AdminAuthGuard()
export class PostManageController {
  constructor(private readonly logger: LoggerService, private readonly postService: PostService) {
    this.logger.setContext(PostManageController.name);
  }

  @Post('query-post')
  @ApiOperation({
    summary: '分页查询所有文章',
    operationId: 'queryPost',
  })
  queryPost(@Pagination() paginateQueryPostDto: PaginateQueryPostDto) {
    return this.postService.paginateQueryPost(paginateQueryPostDto);
  }
}
