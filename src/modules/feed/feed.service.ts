import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  postNewFeed(createFeedDto: CreateFeedDto, user: User) {
    return this.feedDao.save({
      ...createFeedDto,
      createBy: user,
    });
  }

  feeds(ids: User['id'][] = []) {
    return this.feedDao.find({
      where: [
        { public: true },
        {
          createBy: In(ids),
        },
      ],
      order: {
        id: 'DESC',
      },
    });
  }

  update(id: number, updateFeedDto: UpdateFeedDto) {
    return this.feedDao.update(id, updateFeedDto);
  }
}
