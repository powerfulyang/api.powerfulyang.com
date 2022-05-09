import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, MoreThan, Repository } from 'typeorm';
import { firstItem, lastItem } from '@powerfulyang/utils';
import { Feed } from '@/modules/feed/entities/feed.entity';
import { LoggerService } from '@/common/logger/logger.service';
import type { UploadFile } from '@/type/UploadFile';
import { BuiltinBucket } from '@/modules/bucket/entities/bucket.entity';
import type { AuthorizationParams, InfiniteQueryParams } from '@/type/InfiniteQueryParams';
import { DefaultCursor, DefaultTake } from '@/type/InfiniteQueryParams';
import { AssetService } from '../asset/asset.service';
import type { CreateFeedDto } from './dto/create-feed.dto';
import type { UpdateFeedDto } from './dto/update-feed.dto';

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

  async infiniteQuery(params: InfiniteQueryParams<AuthorizationParams> = {}) {
    const { userIds = [], prevCursor, nextCursor } = params;
    const take = Number(params.take) || DefaultTake;
    const cursor = nextCursor
      ? MoreThan(Number(nextCursor))
      : LessThan(Number(prevCursor || DefaultCursor));
    const res = await this.feedDao.find({
      select: {
        id: true,
        content: true,
        createAt: true,
        createBy: {
          avatar: true,
          nickname: true,
        },
        assets: {
          id: true,
          objectUrl: true,
          size: {
            width: true,
            height: true,
          },
        },
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

  updateFeed(id: number, updateFeedDto: UpdateFeedDto) {
    return this.feedDao.update(id, updateFeedDto);
  }
}
