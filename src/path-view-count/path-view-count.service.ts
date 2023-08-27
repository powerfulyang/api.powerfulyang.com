import { LoggerService } from '@/common/logger/logger.service';
import type { ViewCountDto } from '@/path-view-count/dto/view-count.dto';
import { PathViewCount } from '@/path-view-count/entities/path-view-count.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PathViewCountService {
  constructor(
    @InjectRepository(PathViewCount) private readonly pathViewCountDao: Repository<PathViewCount>,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(PathViewCountService.name);
  }

  async viewCount(timezone = 'Asia/Shanghai') {
    return this.pathViewCountDao
      .createQueryBuilder()
      .select(`("createdAt"::timestamptz AT TIME ZONE :timezone)::date::text`, 'date')
      .setParameters({ timezone })
      .addSelect(`count(path)::int`, 'requestCount')
      .addSelect(`count(distinct ip)::int`, 'distinctIpCount')
      .groupBy('date')
      .orderBy('date', 'DESC')
      .getRawMany<ViewCountDto>();
  }
}
