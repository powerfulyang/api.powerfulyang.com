import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { countBy, flatten, map, pluck, prop, trim } from 'ramda';
import { Post } from '@/modules/post/entities/post.entity';
import type { User } from '@/modules/user/entities/user.entity';
import type { PublishPostDto } from '@/modules/post/dto/publish-post.dto';
import { AssetService } from '@/modules/asset/asset.service';
import type { SearchPostDto } from '@/modules/post/dto/search-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postDao: Repository<Post>,
    private readonly assetService: AssetService,
  ) {}

  async publishPost(post: PublishPostDto) {
    if (!post.poster) {
      const poster = await this.assetService.randomPostPoster();
      Reflect.set(post, 'poster', poster);
    }
    if (post.id) {
      const findPost = await this.postDao.findOneByOrFail({ id: post.id });
      findPost.content = post.content!;
      if (post.tags) {
        findPost.tags = post.tags;
      }
      findPost.title = post.title!;
      return this.postDao.save(findPost);
    }
    const toSave = this.postDao.create(post);
    return this.postDao.save(toSave);
  }

  deletePost(post: Post) {
    return this.postDao.delete(post.id);
  }

  readPost(post: Omit<Post, 'createBy'>, ids: User['id'][] = []) {
    return this.postDao.findOneOrFail({
      where: [
        { id: post.id, public: true },
        {
          id: post.id,
          createBy: In(ids),
        },
      ],
    });
  }

  getPosts(post: SearchPostDto, ids: User['id'][] = []) {
    return this.postDao.find({
      select: ['id', 'title', 'content', 'createAt', 'poster'],
      relations: ['poster'],
      order: { id: 'DESC' },
      where: [
        { ...post, createBy: In(ids) },
        { ...post, public: true },
      ],
    });
  }

  async getPublishedTags(ids: User['id'][] = []) {
    const tagsArr = await this.postDao.find({
      select: ['tags'],
      where: [{ createBy: In(ids) }, { public: true }],
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
          createBy: In(ids),
        },
        { public: true },
      ])
      .orderBy('"publishYear"', 'DESC')
      .distinct(true)
      .getRawMany();
    return pluck('publishYear')(res);
  }
}
