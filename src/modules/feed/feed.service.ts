import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindManyOptions} from 'typeorm';
import { In, Repository, Transaction, TransactionRepository } from 'typeorm';
import { Feed } from '@/modules/feed/entities/feed.entity';
import { AppLogger } from '@/common/logger/app.logger';
import type { User } from '@/modules/user/entities/user.entity';
import type { UpdateFeedDto } from './dto/update-feed.dto';
import type { CreateFeedDto } from './dto/create-feed.dto';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed) private feedDao: Repository<Feed>,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(FeedService.name);
  }

  create(createFeedDto: CreateFeedDto) {
    return this.feedDao.save(createFeedDto);
  }

  postNewFeed(createFeedDto: CreateFeedDto, user: User) {
    return this.feedDao.save({
      ...createFeedDto,
      createBy: user,
    });
  }

  findAll() {
    return this.feedDao.findAndCount();
  }

  relationQuery(where?: FindManyOptions<Feed>['where']) {
    return this.feedDao.find({
      relations: [Feed.relationColumnCreateBy, Feed.relationColumnAssets],
      where,
      order: {
        id: 'DESC',
      },
    });
  }

  relationQueryByUserIds(ids: User['id'][]) {
    return this.feedDao.find({
      relations: [Feed.relationColumnCreateBy, Feed.relationColumnAssets],
      where: {
        createBy: In(ids),
      },
      order: {
        id: 'DESC',
      },
    });
  }

  findOne(id: number) {
    return this.feedDao.findOne(id, {
      relations: [Feed.relationColumnCreateBy, Feed.relationColumnAssets],
    });
  }

  update(id: number, updateFeedDto: UpdateFeedDto) {
    return this.feedDao.update(id, updateFeedDto);
  }

  @Transaction()
  batchRemove(ids: number[], @TransactionRepository(Feed) feedRepository?: Repository<Feed>) {
    return feedRepository!.delete(ids);
  }

  publicList() {
    return this.feedDao.find({
      relations: [Feed.relationColumnCreateBy, Feed.relationColumnAssets],
      where: { public: true },
      order: {
        id: 'DESC',
      },
    });
  }
}
