import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { firstItem, lastItem } from '@powerfulyang/utils';
import { Feed } from '@/modules/feed/entities/feed.entity';
import { LoggerService } from '@/common/logger/logger.service';
import { BuiltinBucket } from '@/modules/bucket/entities/bucket.entity';
import type { AuthorizationParams, InfiniteQueryParams } from '@/type/InfiniteQueryParams';
import { BaseService } from '@/common/service/base/BaseService';
import { AssetService } from '../asset/asset.service';
import type { CreateFeedDto } from './dto/create-feed.dto';
import type { UpdateFeedDto } from './dto/update-feed.dto';

@Injectable()
export class FeedService extends BaseService {
  constructor(
    @InjectRepository(Feed) private readonly feedDao: Repository<Feed>,
    private readonly logger: LoggerService,
    private readonly assetService: AssetService,
  ) {
    super();
    this.logger.setContext(FeedService.name);
  }

  all() {
    return this.feedDao.find();
  }

  async postFeed(createFeedDto: CreateFeedDto) {
    const files = createFeedDto.assets || [];
    const assets = await this.assetService.saveAssetToBucket(
      files,
      BuiltinBucket.timeline,
      createFeedDto.createBy,
    );
    return this.feedDao.save({ ...createFeedDto, assets });
  }

  async modifyFeed(updateFeedDto: UpdateFeedDto) {
    const files = updateFeedDto.assets || [];
    const feed = await this.feedDao.findOneOrFail({
      where: {
        id: updateFeedDto.id,
      },
      relations: ['assets', 'createBy'],
    });
    feed.public = updateFeedDto.public;
    feed.content = updateFeedDto.content;
    feed.assets = await this.assetService.saveAssetToBucket(
      files,
      BuiltinBucket.timeline,
      updateFeedDto.updateBy,
    );
    return this.feedDao.save(feed);
  }

  async infiniteQuery(params: InfiniteQueryParams<AuthorizationParams> = {}) {
    const { userIds = [], prevCursor, nextCursor } = params;
    const take = this.formatInfiniteTake(params.take);
    const cursor = this.generateInfiniteCursor({
      nextCursor,
      prevCursor,
    });
    const res = await this.feedDao.find({
      select: {
        id: true,
        content: true,
        createAt: true,
        createBy: {
          avatar: true,
          nickname: true,
          id: true,
        },
        assets: {
          id: true,
          objectUrl: true,
          size: {
            width: true,
            height: true,
          },
        },
        public: true,
      },
      relations: {
        createBy: true,
        assets: true,
      },
      loadEagerRelations: false,
      where: [
        { public: true, id: cursor },
        {
          createBy: In(userIds),
          id: cursor,
        },
      ],
      order: {
        id: 'DESC',
      },
      take,
    });
    return {
      resources: res,
      prevCursor: (res.length === take && lastItem(res)?.id) || null,
      nextCursor: firstItem(res)?.id || null,
    };
  }

  updateFeed(id: number, updateFeedDto: Partial<Feed>) {
    return this.feedDao.update(id, updateFeedDto);
  }

  async deleteFeed(feed: Pick<Feed, 'id' | 'createBy'>) {
    const result = await this.feedDao.delete({
      id: feed.id,
      createBy: {
        id: feed.createBy.id,
      },
    });
    if (result.affected === 0) {
      throw new ForbiddenException('You can only delete your own post!');
    }
  }
}
