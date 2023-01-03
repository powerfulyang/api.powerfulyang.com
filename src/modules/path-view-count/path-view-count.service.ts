import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { groupBy } from 'ramda';
import { ip2long } from '@powerfulyang/node-utils';
import { PathViewCount } from '@/modules/path-view-count/entities/path-view-count.entity';
import { CacheService } from '@/common/cache/cache.service';
import { LoggerService } from '@/common/logger/logger.service';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';
import type { ViewCountDto } from '@/modules/path-view-count/dto/view-count.dto';

@Injectable()
export class PathViewCountService {
  constructor(
    @InjectRepository(PathViewCount) private readonly pathViewCountDao: Repository<PathViewCount>,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(PathViewCountService.name);
  }

  async initPathViewCountCache() {
    const results = await this.pathViewCountDao.find({
      select: ['path', 'ip'],
    });
    const mapSet = groupBy<PathViewCount>((a) => a.path)(results);
    Object.entries(mapSet).forEach(([path, set]) => {
      // 先清理再缓存
      const handleKey = REDIS_KEYS.PATH_VIEW_COUNT_PREFIX(path);
      this.cacheService.sadd(
        handleKey,
        set.map((x) => x.ip.toString()),
      );
    });

    return mapSet;
  }

  async handlePathViewCount(path: string, ip: string) {
    const ipLong = ip2long(ip);
    const redisKey = REDIS_KEYS.PATH_VIEW_COUNT_PREFIX(path);
    await this.cacheService.sadd(redisKey, ipLong);
    const viewCount = await this.cacheService.scard(redisKey);
    // 不管是否是新的 ip 访问，都要记录。
    this.pathViewCountDao.insert({ ip: ipLong, path }).catch((e) => {
      this.logger.error(e);
    });
    return viewCount;
  }

  async viewCount(timezone = 'Asia/Shanghai') {
    return this.pathViewCountDao
      .createQueryBuilder()
      .select(`("createAt"::timestamptz AT TIME ZONE :timezone)::date::text`, 'date')
      .setParameters({ timezone })
      .addSelect(`count(path)::int`, 'requestCount')
      .addSelect(`count(distinct ip)::int`, 'distinctIpCount')
      .groupBy('date')
      .orderBy('date', 'DESC')
      .getRawMany<ViewCountDto>();
  }
}
