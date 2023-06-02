import { LoggerService } from '@/common/logger/logger.service';
import { AlgoliaService } from '@/common/service/algolia/AlgoliaService';
import { BaseService } from '@/common/service/base/BaseService';
import { BuiltinBucket } from '@/bucket/entities/bucket.entity';
import type { QueryFeedsDto } from '@/feed/dto/query-feeds.dto';
import { Feed } from '@/feed/entities/feed.entity';
import type { AuthorizationParams, InfiniteQueryParams } from '@/type/InfiniteQueryParams';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstItem, lastItem } from '@powerfulyang/utils';
import { In, Repository } from 'typeorm';
import { AssetService } from '@/asset/asset.service';
import type { CreateFeedDto } from './dto/create-feed.dto';
import type { UpdateFeedDto } from './dto/update-feed.dto';

@Injectable()
export class FeedService extends BaseService {
  constructor(
    @InjectRepository(Feed) private readonly feedDao: Repository<Feed>,
    private readonly logger: LoggerService,
    private readonly assetService: AssetService,
    private readonly algoliaService: AlgoliaService,
  ) {
    super();
    this.logger.setContext(FeedService.name);
  }

  async postFeed(createFeedDto: CreateFeedDto) {
    const files = createFeedDto.assets || [];
    const assets = await this.assetService.saveAssetToBucket(
      files,
      BuiltinBucket.timeline,
      createFeedDto.createBy,
    );
    const feed: Feed = await this.feedDao.save({ ...createFeedDto, assets });
    this.algoliaService.reindexAlgoliaCrawler().catch((e) => {
      this.logger.error(e);
    });
    return feed;
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
    const saved = await this.feedDao.save(feed);
    this.algoliaService.reindexAlgoliaCrawler().catch((e) => {
      this.logger.error(e);
    });
    return saved;
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
        createdAt: true,
        createBy: {
          avatar: true,
          nickname: true,
          id: true,
        },
        assets: {
          id: true,
          objectUrl: {
            webp: true,
            original: true,
            thumbnail_blur_: true,
            thumbnail_700_: true,
            thumbnail_300_: true,
          },
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
    this.algoliaService.reindexAlgoliaCrawler().catch((e) => {
      this.logger.error(e);
    });
  }

  queryFeeds(pagination: QueryFeedsDto) {
    const { id, skip, take } = pagination;
    return this.feedDao.findAndCount({
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        createBy: {
          nickname: true,
        },
      },
      relations: {
        createBy: true,
      },
      where: {
        id: super.ignoreFalsyValue(id),
      },
      skip,
      take,
      order: {
        id: 'DESC',
      },
    });
  }

  async deleteFeedById(id: number) {
    const res = await this.feedDao.delete(id);
    if (res.affected === 0) {
      throw new Error('Delete feed failed');
    }
  }
}
