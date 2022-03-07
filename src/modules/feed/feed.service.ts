import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Feed } from '@/modules/feed/entities/feed.entity';
import { AppLogger } from '@/common/logger/app.logger';
import type { User } from '@/modules/user/entities/user.entity';
import type { UpdateFeedDto } from './dto/update-feed.dto';
import type { CreateFeedDto } from './dto/create-feed.dto';
import type { UploadFile } from '@/type/UploadFile';
import { AssetService } from '../asset/asset.service';
import { BuiltinBucket } from '@/modules/bucket/entities/bucket.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed) private feedDao: Repository<Feed>,
    private readonly logger: AppLogger,
    private readonly assetService: AssetService,
  ) {
    this.logger.setContext(FeedService.name);
  }

  async postNewFeed(createFeedDto: CreateFeedDto & Pick<Feed, 'createBy'>, files: UploadFile[]) {
    const assets = await this.assetService.saveAssetToBucket(
      files,
      BuiltinBucket.timeline,
      createFeedDto.createBy,
    );
    return this.feedDao.save({ ...createFeedDto, assets });
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
