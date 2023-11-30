import { LoggerService } from '@/common/logger/logger.service';
import type { QueryRequestLogDto } from '@/request-log/dto/query-request-log.dto';
import type { RequestLogDto } from '@/request-log/dto/request-log.dto';
import { RequestLog } from '@/request-log/entities/request-log.entity';
import { BaseService } from '@/service/base/BaseService';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RequestLogService extends BaseService {
  constructor(
    @InjectRepository(RequestLog) private readonly requestLogDao: Repository<RequestLog>,
    private readonly logger: LoggerService,
  ) {
    super();
    this.logger.setContext(RequestLogService.name);
  }

  async viewCount(timezone = 'Asia/Shanghai') {
    return this.requestLogDao
      .createQueryBuilder()
      .select(`("createdAt"::timestamptz AT TIME ZONE :timezone)::date::text`, 'date')
      .setParameters({ timezone })
      .addSelect(`count(path)::int`, 'requestCount')
      .addSelect(`count(distinct ip)::int`, 'distinctIpCount')
      .groupBy('date')
      .orderBy('date', 'DESC')
      .getRawMany<RequestLogDto>();
  }

  async log(requestLog: Omit<RequestLog, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.requestLogDao.save(requestLog);
  }

  queryLogs(paginateQueryRequestLogDto: QueryRequestLogDto) {
    const {
      id,
      updatedAt,
      createdAt,
      skip,
      take,
      requestId,
      statusCode,
      path,
      referer,
      userAgent,
      ip,
      ipInfo,
      contentLength,
      method,
      processTime,
    } = paginateQueryRequestLogDto;
    return this.requestLogDao.findAndCount({
      where: {
        id: super.ignoreFalsyValue(id),
        createdAt: super.convertDateRangeToBetween(createdAt),
        updatedAt: super.convertDateRangeToBetween(updatedAt),
        requestId: super.ignoreFalsyValue(requestId),
        statusCode: super.ignoreFalsyValue(statusCode),
        path: super.iLike(path),
        referer: super.iLike(referer),
        userAgent: super.iLike(userAgent),
        ip,
        ipInfo: super.iLike(ipInfo),
        contentLength: super.ignoreEmptyString(contentLength),
        method: super.ignoreEmptyString(method),
        processTime: super.iLike(processTime),
      },
      take,
      skip,
      order: {
        id: 'DESC',
      },
    });
  }
}
