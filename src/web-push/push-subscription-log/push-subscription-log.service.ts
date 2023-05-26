import type { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { LoggerService } from '@/common/logger/logger.service';
import type { User } from '@/modules/user/entities/user.entity';
import { PushSubscriptionLog } from '@/web-push/entities/PushSubscriptionLog.entity';
import type { PushSubscriptionJSON } from '@/web-push/PushSubscriptionJSON';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PushSubscriptionLogService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(PushSubscriptionLog)
    private readonly pushSubscriptionLogDao: Repository<PushSubscriptionLog>,
  ) {
    this.logger.setContext(PushSubscriptionLogService.name);
  }

  async subscribe(user: User | undefined, subscription: PushSubscriptionJSON) {
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
      if (user && p.user?.id !== user?.id) {
        // update user
        p.user = user;
        return this.pushSubscriptionLogDao.save(p);
      }
      // ignore
      return p;
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
