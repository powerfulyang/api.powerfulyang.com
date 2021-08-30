import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '@/entity/post.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { pluck } from 'ramda';

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

  getAll(where?: FindManyOptions<Post>['where']) {
    return this.postDao.find({ where, order: { id: 'DESC' } });
  }

  get(draft: Post) {
    return this.postDao.findOneOrFail(draft);
  }

  publicRead(post: Post) {
    return this.postDao.findOneOrFail({
      where: { id: post.id, public: true },
      relations: [Post.RelationColumnCreateBy],
    });
  }

  async publicList(query: Post) {
    const posts = await this.postDao.find({
      select: ['id', 'title', 'createAt'],
      order: { id: 'DESC' },
      where: {
        ...query,
        public: true,
      },
    });
    return { posts };
  }

  tagsArray(justPublic: boolean = true) {
    return this.postDao.find({ select: ['tags'], where: { public: justPublic } });
  }

  async getPublishedYears() {
    const res: Array<Pick<Post, 'publishYear'>> = await this.postDao
      .createQueryBuilder()
      .select(['publishYear'])
      .distinct(true)
      .getRawMany();
    return pluck('publishYear')(res);
  }
}
