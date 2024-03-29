import { Controller, Delete, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { QueryPagination } from '@/common/decorator/pagination/pagination.decorator';
import { Permission, Permissions } from '@/common/decorator/permissions.decorator';
import { LoggerService } from '@/common/logger/logger.service';
import { QueryFeedsDto } from '@/feed/dto/query-feeds.dto';
import { FeedService } from '@/feed/feed.service';

@Controller('feed-manage')
@ApiTags('feed-manage')
@PermissionAuthGuard()
export class FeedManageController {
  constructor(
    private readonly logger: LoggerService,
    private readonly feedService: FeedService,
  ) {
    this.logger.setContext(FeedManageController.name);
  }

  @Get('query-feeds')
  @ApiOperation({
    summary: '分页查询说说',
    operationId: 'queryFeeds',
  })
  @Permissions(Permission.FeedManageQuery)
  queryFeeds(@QueryPagination() pagination: QueryFeedsDto) {
    return this.feedService.queryFeeds(pagination);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '删除说说',
    operationId: 'deleteFeedById',
  })
  @Permissions(Permission.FeedManageDelete)
  deleteFeedById(@Param('id') id: number) {
    return this.feedService.deleteFeedById(id);
  }
}
