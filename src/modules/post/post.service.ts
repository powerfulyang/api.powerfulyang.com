import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from '@/entity/posts.entity';
import { Repository } from 'typeorm';
import { PostDto } from '@/entity/dto/PostDto';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Posts) readonly postDao: Repository<Posts>) {}

  async createPost(post: Posts) {
    if (post.id) {
      const findPost = await this.postDao.findOneOrFail(post.id);
      findPost.content = post.content;
      findPost.tags = post.tags;
      findPost.title = post.title;
      return this.postDao.save(findPost);
    }
    return this.postDao.save(post);
  }

  deletePost(draft: Posts) {
    return this.postDao.delete(draft);
  }

  updatePost(post: Posts) {
    return this.postDao.update(post.id, post);
  }

  getAll(post?: PostDto) {
    return this.postDao.find({ where: post, order: { id: 'DESC' } });
  }

  get(draft: Posts) {
    return this.postDao.findOneOrFail(draft);
  }

  publicRead(post: Posts) {
    return this.postDao.findOneOrFail({
      where: { id: post.id },
      relations: ['user'],
    });
  }

  async publicList() {
    const posts = await this.postDao.find({
      select: ['id', 'title', 'createAt'],
      order: { id: 'DESC' },
    });
    return { posts };
  }
}
