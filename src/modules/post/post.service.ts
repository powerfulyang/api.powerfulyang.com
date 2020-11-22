import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from '@/entity/posts.entity';
import { Repository } from 'typeorm';
import { PostDto } from '@/entity/dto/PostDto';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Posts) private postDao: Repository<Posts>) {}

  createPost(post: Posts) {
    return this.postDao.save(post);
  }

  deletePost(draft: Posts) {
    return this.postDao.delete(draft);
  }

  updatePost(post: Posts) {
    return this.postDao.update(post.id, post);
  }

  getAll(post?: PostDto) {
    return this.postDao.find(post);
  }

  get(draft: Posts) {
    return this.postDao.findOneOrFail(draft);
  }
}
