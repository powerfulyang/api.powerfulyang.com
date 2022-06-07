import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { countBy, flatten, map, pluck, prop, trim } from 'ramda';
import { Post } from '@/modules/post/entities/post.entity';
import type { User } from '@/modules/user/entities/user.entity';
import type { PublishPostDto } from '@/modules/post/dto/publish-post.dto';
import { AssetService } from '@/modules/asset/asset.service';
import type { SearchPostDto } from '@/modules/post/dto/search-post.dto';
import { SUCCESS } from '@/constants/constants';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postDao: Repository<Post>,
    private readonly assetService: AssetService,
  ) {}

  all() {
    return this.postDao.find();
  }

  async publishPost(post: PublishPostDto) {
    if (!post.poster) {
      const poster = await this.assetService.randomAsset();
      Reflect.set(post, 'poster', poster);
    }
    if (post.id) {
      // update
      const findPost = await this.postDao.findOneByOrFail({ id: post.id });
      findPost.content = post.content;
      if (post.tags) {
        findPost.tags = post.tags;
      }
      findPost.title = post.title;
      return this.postDao.save(findPost);
    }
    const toSave = this.postDao.create(post);
    return this.postDao.save(toSave);
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

  readPost(id: Post['id'], ids: User['id'][] = []) {
    return this.postDao.findOneOrFail({
      where: [
        { id, public: true },
        {
          id,
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
}
