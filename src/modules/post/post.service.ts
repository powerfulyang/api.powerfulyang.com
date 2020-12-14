import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from '@/entity/posts.entity';
import { Repository } from 'typeorm';
import { PostDto } from '@/entity/dto/PostDto';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Posts) readonly postDao: Repository<Posts>) {}

  createPost(post: Posts) {
    if (post.id) {
      return this.postDao.update(post.id, post);
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
