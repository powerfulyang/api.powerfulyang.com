import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { FeedService } from '@/modules/feed/feed.service';
import { LoggerService } from '@/common/logger/logger.service';
import { Pagination } from '@/common/decorator/pagination/pagination.decorator';
import { QueryFeedsDto } from '@/modules/feed/dto/query-feeds.dto';

@Controller('feed-manage')
@ApiTags('feed-manage')
@AdminAuthGuard()
export class FeedManageController {
  constructor(private readonly logger: LoggerService, private readonly feedService: FeedService) {
    this.logger.setContext(FeedManageController.name);
  }

  @Get('query-feeds')
  @ApiOperation({
    summary: '分页查询说说',
    operationId: 'queryFeeds',
  })
  queryFeeds(@Pagination() pagination: QueryFeedsDto) {
    return this.feedService.queryFeeds(pagination);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '删除说说',
    operationId: 'deleteFeedById',
  })
  deleteFeedById(@Param('id') id: number) {
    return this.feedService.deleteFeedById(id);
  }
}
