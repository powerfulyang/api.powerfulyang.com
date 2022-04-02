import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
import { lastItem } from '@powerfulyang/utils';
import { Feed } from '@/modules/feed/entities/feed.entity';
import { LoggerService } from '@/common/logger/logger.service';
import type { User } from '@/modules/user/entities/user.entity';
import type { UpdateFeedDto } from './dto/update-feed.dto';
import type { CreateFeedDto } from './dto/create-feed.dto';
import type { UploadFile } from '@/type/UploadFile';
import { AssetService } from '../asset/asset.service';
import { BuiltinBucket } from '@/modules/bucket/entities/bucket.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed) private readonly feedDao: Repository<Feed>,
    private readonly logger: LoggerService,
    private readonly assetService: AssetService,
  ) {
    this.logger.setContext(FeedService.name);
  }

  all() {
    return this.feedDao.find();
  }

  async postNewFeed(
    createFeedDto: CreateFeedDto & Pick<Feed, 'createBy'>,
    files: UploadFile[] = [],
  ) {
    const assets = await this.assetService.saveAssetToBucket(
      files,
      BuiltinBucket.timeline,
      createFeedDto.createBy,
    );
    return this.feedDao.save({ ...createFeedDto, assets });
  }

  async infiniteQuery(cursor?: string | number, take: number = 20, ids: User['id'][] = []) {
    const res = await this.feedDao.find({
      where: [
        { public: true, id: LessThan(Number(cursor) || 2 ** 31 - 1) },
        {
          createBy: In(ids),
          id: LessThan(Number(cursor) || 2 ** 31 - 1),
        },
      ],
      order: {
        id: 'DESC',
      },
      take,
    });
    return {
      resources: res,
      nextCursor: res.length === take ? lastItem(res)?.id : undefined,
    };
  }

  updateFeed(id: number, updateFeedDto: UpdateFeedDto) {
    return this.feedDao.update(id, updateFeedDto);
  }
}
