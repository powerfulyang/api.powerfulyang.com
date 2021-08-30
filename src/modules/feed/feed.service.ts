import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from '@/modules/feed/entities/feed.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { AppLogger } from '@/common/logger/app.logger';
import { User } from '@/entity/user.entity';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { CreateFeedDto } from './dto/create-feed.dto';

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

  findOne(id: number) {
    return this.feedDao.findOne(id, {
      relations: [Feed.relationColumnCreateBy, Feed.relationColumnAssets],
    });
  }

  update(id: number, updateFeedDto: UpdateFeedDto) {
    return this.feedDao.update(id, updateFeedDto);
  }

  remove(id: number) {
    return this.feedDao.delete(id);
  }

  publicList() {
    return this.feedDao.find({
      relations: [
        Feed.relationColumnCreateBy,
        Feed.relationColumnAssets,
        `${Feed.relationColumnCreateBy}.${User.RelationColumnTimelineBackground}`,
      ],
      where: { public: true },
      order: {
        id: 'DESC',
      },
    });
  }
}
