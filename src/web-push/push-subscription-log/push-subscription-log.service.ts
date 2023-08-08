import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { LoggerService } from '@/common/logger/logger.service';
import type { User } from '@/user/entities/user.entity';
import type { PushSubscriptionJSONDto } from '@/web-push/dto/PushSubscriptionJSON.dto';
import { PushSubscriptionLog } from '@/web-push/entities/push-subscription-log.entity';

@Injectable()
export class PushSubscriptionLogService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(PushSubscriptionLog)
    private readonly pushSubscriptionLogDao: Repository<PushSubscriptionLog>,
  ) {
    this.logger.setContext(PushSubscriptionLogService.name);
  }

  async subscribe(user: User | undefined, subscription: PushSubscriptionJSONDto) {
    const p = await this.pushSubscriptionLogDao.findOne({
      where: {
        endpoint: subscription.endpoint,
      },
      relations: ['user'],
      select: {
        user: {
          id: true,
        },
      },
    });
    if (p) {
      p.updatedAt = new Date();
      if (user && p.user?.id !== user.id) {
        p.user = user;
        return this.pushSubscriptionLogDao.save(p);
      }
      return this.pushSubscriptionLogDao.save(p);
    }
    return this.pushSubscriptionLogDao.save({
      user,
      pushSubscriptionJSON: subscription,
    });
  }

  list(pagination: PaginatedBaseQuery) {
    return this.pushSubscriptionLogDao.findAndCount({
      ...pagination,
      relations: ['user'],
    });
  }

  findOne(id: number) {
    return this.pushSubscriptionLogDao.findOneByOrFail({ id });
  }
}
