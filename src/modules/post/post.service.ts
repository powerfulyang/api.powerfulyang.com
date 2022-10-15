import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { countBy, flatten, map, pick, pluck, prop, trim } from 'ramda';
import { Post } from '@/modules/post/entities/post.entity';
import type { User } from '@/modules/user/entities/user.entity';
import type { PublishPostDto } from '@/modules/post/dto/publish-post.dto';
import { AssetService } from '@/modules/asset/asset.service';
import type { SearchPostDto } from '@/modules/post/dto/search-post.dto';
import { SUCCESS } from '@/constants/constants';
import { EsService, POST_INDEX } from '@/common/service/es/es.service';
import type { ElasticsearchService } from '@nestjs/elasticsearch';
import { LoggerService } from '@/common/logger/logger.service';
import { isNumeric } from '@powerfulyang/utils';

@Injectable()
export class PostService {
  private readonly es: ElasticsearchService;

  constructor(
    @InjectRepository(Post) private readonly postDao: Repository<Post>,
    private readonly assetService: AssetService,
    private readonly esService: EsService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(PostService.name);
    this.es = this.esService.getEsClient();
    this.buildPostEsIndex()
      .then((count) => {
        this.logger.info(`build post es index success, count: ${count}`);
      })
      .catch((err) => {
        this.logger.error(`build post es index failed`, err);
      });
  }

  all() {
    return this.postDao.find();
  }

  async updatePost(post: PublishPostDto) {
    // update
    const findPost = await this.postDao.findOneOrFail({
      where: {
        id: post.id,
      },
      relations: ['createBy'],
    });
    findPost.content = post.content;
    findPost.title = post.title;
    if (post.tags) {
      findPost.tags = post.tags;
    }
    if (post.posterId) {
      findPost.poster = await this.assetService.getAssetById(post.posterId);
    }
    findPost.urlTitle = Post.generateUrlTitle(findPost);
    return this.postDao.save(findPost);
  }

  async createPost(post: PublishPostDto) {
    if (!post.posterId) {
      const poster = await this.assetService.randomAsset();
      Reflect.set(post, 'poster', poster);
    } else {
      const poster = await this.assetService.getAssetById(post.posterId);
      Reflect.set(post, 'poster', poster);
    }
    const toSave = this.postDao.create(post);
    return this.postDao.save(toSave);
  }

  async publishPost(post: PublishPostDto) {
    if (post.id) {
      return this.updatePost(post);
    }
    return this.createPost(post);
  }

  async deletePost(post: Pick<Post, 'id' | 'createBy'>) {
    const result = await this.postDao.delete({
      id: post.id,
      createBy: {
        id: post.createBy.id,
      },
    });
    if (result.affected === 1) {
      return SUCCESS;
    }
    throw new ForbiddenException('You can only delete your own post!');
  }

  readPost(id: Post['id'] | Post['urlTitle'], ids: User['id'][] = []) {
    if (isNumeric(id)) {
      return this.postDao.findOneOrFail({
        where: [
          { id: Number(id), public: true },
          {
            id: Number(id),
            createBy: {
              id: In(ids),
            },
          },
        ],
      });
    }
    return this.postDao.findOneOrFail({
      where: [
        { urlTitle: String(id), public: true },
        {
          urlTitle: String(id),
          createBy: {
            id: In(ids),
          },
        },
      ],
    });
  }

  queryPosts(post: SearchPostDto, ids: User['id'][] = []) {
    return this.postDao.find({
      select: {
        id: true,
        title: true,
        createAt: true,
        urlTitle: true,
        poster: {
          objectUrl: true,
          size: {
            width: true,
            height: true,
          },
        },
      },
      order: { id: 'DESC' },
      relations: ['poster'],
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

  async getPublishedTags(ids: User['id'][] = []) {
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
    const allTags = flatten(map(prop('tags'))(tagsArr));
    return countBy(trim)(allTags);
  }

  async getPublishedYears(ids: User['id'][] = []) {
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
    return pluck('publishYear')(res);
  }

  async buildPostEsIndex() {
    const exist = await this.es.indices.exists({ index: POST_INDEX });
    if (!exist) {
      await this.es.indices.create(
        {
          index: POST_INDEX,
          mappings: {
            properties: {
              id: { type: 'integer' },
              content: { type: 'text' },
              title: { type: 'text' },
            },
          },
        },
        { ignore: [400] },
      );
    }
    const posts = await this.all();
    const body = posts.flatMap((post) => {
      return [
        { index: { _index: POST_INDEX, _id: post.id } },
        pick(['id', 'content', 'title'], post),
      ];
    });
    const result = await this.es.bulk({
      body,
    });
    return result.items.length;
  }

  async searchPostByContent(content: string) {
    const results: any[] = [];
    const result = await this.es.search({
      index: POST_INDEX,
      body: {
        query: {
          match: {
            content: {
              query: content,
            },
          },
        },
      },
    });
    result.hits.hits.forEach((item) => {
      results.push(item._source);
    });

    return { results, total: result.hits.hits.length };
  }
}
