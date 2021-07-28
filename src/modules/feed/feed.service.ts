import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from '@/modules/feed/entities/feed.entity';
import { Repository } from 'typeorm';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { CreateFeedDto } from './dto/create-feed.dto';

@Injectable()
export class FeedService {
  constructor(@InjectRepository(Feed) private feedDao: Repository<Feed>) {}

  create(createFeedDto: CreateFeedDto) {
    return this.feedDao.save(createFeedDto);
  }

  findAll() {
    return this.feedDao.findAndCount();
  }

  findOne(id: number) {
    return this.feedDao.findOne(id);
  }

  update(id: number, updateFeedDto: UpdateFeedDto) {
    return this.feedDao.update(id, updateFeedDto);
  }

  remove(id: number) {
    return this.feedDao.delete(id);
  }
}
