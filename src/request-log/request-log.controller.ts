import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { BodyPagination } from '@/common/decorator/pagination/pagination.decorator';
import { LoggerService } from '@/common/logger/logger.service';
import { ApiOkPaginateQueryResponse } from '@/common/swagger/ApiOkPaginateQueryResponse';
import { QueryRequestLogDto } from '@/request-log/dto/query-request-log.dto';
import { RequestLog } from '@/request-log/entities/request-log.entity';
import { RequestLogService } from '@/request-log/request-log.service';
import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('request-log-manage')
@ApiTags('request-log-manage')
@AdminAuthGuard()
export class RequestLogController {
  constructor(
    private readonly logger: LoggerService,
    private readonly requestLogService: RequestLogService,
  ) {
    this.logger.setContext(RequestLogController.name);
  }

  @Post('query-logs')
  @ApiOperation({
    summary: '分页查询请求日志',
    operationId: 'queryLogs',
  })
  @ApiOkPaginateQueryResponse({
    model: RequestLog,
    description: '分页查询请求日志响应',
  })
  queryLogs(@BodyPagination() paginateQueryRequestLogDto: QueryRequestLogDto) {
    return this.requestLogService.queryLogs(paginateQueryRequestLogDto);
  }
}
