import { LoggerService } from '@/common/logger/logger.service';
import { AlgoliaService } from '@/common/service/algolia/AlgoliaService';
import { BaseService } from '@/common/service/base/BaseService';
import { AssetService } from '@/modules/asset/asset.service';
import type { CreatePostDto } from '@/modules/post/dto/create-post.dto';
import type { PatchPostDto } from '@/modules/post/dto/patch-post.dto';
import type { QueryPostsDto } from '@/modules/post/dto/query-posts.dto';
import type { SearchPostDto } from '@/modules/post/dto/search-post.dto';
import { PostLog } from '@/modules/post/entities/post-log.entity';
import { Post } from '@/modules/post/entities/post.entity';
import type { User } from '@/modules/user/entities/user.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { isDefined } from '@powerfulyang/utils';
import { countBy, flatten, map, pick, trim } from 'lodash';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class PostService extends BaseService {
  constructor(
    @InjectRepository(Post) private readonly postDao: Repository<Post>,
    private readonly assetService: AssetService,
    private readonly logger: LoggerService,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly algoliaService: AlgoliaService,
  ) {
    super();
    this.logger.setContext(PostService.name);
  }

  /**
   * 更新文章
   * @param post
   */
  async updatePost(post: PatchPostDto) {
    // update
    const findPost = await this.postDao.findOneOrFail({
      where: {
        id: post.id,
      },
      relations: ['createBy'],
    });

    if (findPost.createBy.id !== post.updateBy.id) {
      throw new ForbiddenException('You can only update your own post!');
    }

    findPost.content = post.content;
    findPost.title = post.title;
    if (post.tags) {
      findPost.tags = post.tags;
    }
    if (post.posterId) {
      findPost.poster = await this.assetService.getAssetById(post.posterId);
    }
    if (isDefined(post.public)) {
      findPost.public = post.public;
    }
    if (post.summary) {
      findPost.summary = post.summary;
    }
    return this.dataSource.transaction(async (manager) => {
      const saved = await manager.save(findPost);
      await manager.save(PostLog, {
        post: saved,
        content: post.content,
        title: post.title,
      });
      this.algoliaService.reindexAlgoliaCrawler().catch((e) => {
        this.logger.error(e);
      });
      return saved;
    });
  }

  /**
   * 新建文章
   * @param post
   */
  async createPost(post: CreatePostDto) {
    const draft = pick(post, [
      'title',
      'content',
      'summary',
      'tags',
      'posterId',
      'public',
      'createBy',
    ]);
    if (!draft.posterId) {
      const poster = await this.assetService.randomPoster();
      Reflect.set(draft, 'poster', poster);
    } else {
      const poster = await this.assetService.getAssetById(draft.posterId);
      Reflect.set(draft, 'poster', poster);
    }
    const toSave = this.postDao.create(draft);
    return this.dataSource.transaction(async (manager) => {
      const saved = await manager.save(toSave);
      await manager.save(PostLog, {
        post: saved,
        content: post.content,
        title: post.title,
      });
      this.algoliaService.reindexAlgoliaCrawler().catch((e) => {
        this.logger.error(e);
      });
      return saved;
    });
  }

  /**
   * 删除文章
   * @param post
   */
  async deletePost(post: Pick<Post, 'id' | 'createBy'>) {
    const result = await this.postDao.delete({
      id: post.id,
      createBy: {
        id: post.createBy.id,
      },
    });
    if (result.affected === 0) {
      throw new ForbiddenException('You can only delete your own post!');
    }
    this.algoliaService.reindexAlgoliaCrawler().catch((e) => {
      this.logger.error(e);
    });
  }

  /**
   * 读取文章
   * @param id
   * @param ids
   * @param versions
   */
  readPost(id: Post['id'], ids: User['id'][] = [], versions?: string[]) {
    return this.postDao.findOneOrFail({
      where: [
        {
          id: Number(id),
          public: true,
          logs: {
            id: super.ignoreEmptyArray(versions),
          },
        },
        {
          id: Number(id),
          createBy: {
            id: In(ids),
          },
          logs: {
            id: super.ignoreEmptyArray(versions),
          },
        },
      ],
      relations: ['logs'],
      order: {
        logs: {
          id: 'DESC',
        },
      },
    });
  }

  /**
   * 查询文章
   * @param post
   * @param ids
   */
  searchPosts(post?: SearchPostDto, ids: User['id'][] = []) {
    return this.postDao.find({
      select: {
        id: true,
        title: true,
        createdAt: true,
        poster: {
          objectUrl: {
            thumbnail_300_: true,
            thumbnail_700_: true,
            original: true,
            webp: true,
            thumbnail_blur_: true,
          },
          size: {
            width: true,
            height: true,
          },
        },
        summary: true,
        createBy: {
          nickname: true,
        },
      },
      order: { id: 'DESC' },
      relations: ['poster', 'createBy'],
      loadEagerRelations: false,
      where: [
        {
          ...post,
          createBy: {
            id: In(ids),
          },
        },
        { ...post, public: true },
      ],
    });
  }

  /**
   * 查询文章标签
   * @param ids
   */
  async queryPublishedTags(ids: User['id'][] = []) {
    const tagsArr = await this.postDao.find({
      select: ['tags'],
      where: [
        {
          createBy: {
            id: In(ids),
          },
        },
        { public: true },
      ],
    });
    const tags = flatten(tagsArr.map((item) => item.tags));
    return countBy(tags, trim);
  }

  /**
   * 查询文章年份
   * @param ids
   */
  async queryPublishedYears(ids: User['id'][] = []) {
    const res: Array<Pick<Post, 'publishYear'>> = await this.postDao
      .createQueryBuilder()
      .select(['"publishYear"'])
      .where([
        {
          createBy: {
            id: In(ids),
          },
        },
        { public: true },
      ])
      .orderBy('"publishYear"', 'DESC')
      .distinct(true)
      .getRawMany();
    return map(res, 'publishYear');
  }

  queryPosts(paginateQueryPostDto: Partial<QueryPostsDto> = {}) {
    const {
      id,
      title,
      take,
      createdAt,
      skip,
      content,
      public: _p,
      updatedAt,
      poster,
      summary,
      createBy,
    } = paginateQueryPostDto;
    return this.postDao.findAndCount({
      where: {
        id: super.ignoreFalsyValue(id),
        title: super.iLike(title),
        createdAt: super.convertDateRangeToBetween(createdAt),
        content: super.iLike(content),
        public: super.ignoreNilValue(_p),
        updatedAt: super.convertDateRangeToBetween(updatedAt),
        poster: {
          id: super.ignoreFalsyValue(poster?.id),
        },
        summary: super.iLike(summary),
        createBy: {
          nickname: super.iLike(createBy?.nickname),
        },
      },
      relations: {
        createBy: true,
        poster: true,
      },
      select: {
        createBy: {
          nickname: true,
        },
        poster: {
          objectUrl: {
            thumbnail_300_: true,
            thumbnail_700_: true,
            original: true,
            webp: true,
            thumbnail_blur_: true,
          },
        },
      },
      take,
      skip,
      order: {
        id: 'DESC',
      },
    });
  }
}
