import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '@/entity/post.entity';
import { In, Repository } from 'typeorm';
import { countBy, flatten, map, pluck, prop, trim } from 'ramda';
import { User } from '@/entity/user.entity';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) readonly postDao: Repository<Post>) {}

  async createPost(post: Post) {
    if (post.id) {
      const findPost = await this.postDao.findOneOrFail(post.id);
      findPost.content = post.content;
      findPost.tags = post.tags;
      findPost.title = post.title;
      return this.postDao.save(findPost);
    }
    return this.postDao.save(post);
  }

  deletePost(draft: Post) {
    return this.postDao.delete(draft);
  }

  updatePost(post: Post) {
    return this.postDao.update(post.id, post);
  }

  getAllPostByUserIds(ids: User['id'][], post: Post) {
    return this.postDao.find({
      select: ['id', 'title', 'createAt'],
      order: { id: 'DESC' },
      where: { ...post, createBy: In(ids) },
    });
  }

  get(draft: Post) {
    return this.postDao.findOneOrFail(draft, { relations: [Post.RelationColumnCreateBy] });
  }

  publicRead(post: Post) {
    return this.postDao.findOneOrFail({
      where: { id: post.id, public: true },
      relations: [Post.RelationColumnCreateBy],
    });
  }

  publicList(query: Post) {
    return this.postDao.find({
      select: ['id', 'title', 'createAt'],
      order: { id: 'DESC' },
      where: {
        ...query,
        public: true,
      },
    });
  }

  tagsArray(justPublic: boolean = true) {
    return this.postDao.find({ select: ['tags'], where: { public: justPublic } });
  }

  async getPublishedTags(ids: User['id'][]) {
    const tagsArr = await this.postDao.find({ select: ['tags'], where: { createBy: In(ids) } });
    const allTags = flatten(map(prop('tags'), tagsArr));
    return countBy(trim)(allTags);
  }

  async getPublishedYears(ids: User['id'][]) {
    const res: Array<Pick<Post, 'publishYear'>> = await this.postDao
      .createQueryBuilder()
      .select(['publishYear'])
      .where('createById in (:...ids)', {
        ids,
      })
      .distinct(true)
      .getRawMany();
    return pluck('publishYear')(res);
  }

  async publicPublishedYears() {
    const res: Array<Pick<Post, 'publishYear'>> = await this.postDao
      .createQueryBuilder()
      .select(['publishYear'])
      .distinct(true)
      .getRawMany();
    return pluck('publishYear')(res);
  }
}
