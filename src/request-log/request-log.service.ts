import { LoggerService } from '@/common/logger/logger.service';
import type { RequestLogDto } from '@/request-log/dto/request-log.dto';
import { RequestLog } from '@/request-log/entities/request-log.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RequestLogService {
  constructor(
    @InjectRepository(RequestLog) private readonly requestLogDao: Repository<RequestLog>,
    private readonly logger: LoggerService,
  ) {
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
}
