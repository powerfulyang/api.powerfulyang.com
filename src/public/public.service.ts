import { Injectable } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger';
import { PostService } from '@/modules/post/post.service';
import { Posts } from '@/entity/posts.entity';

@Injectable()
export class PublicService {
  constructor(private logger: AppLogger, private postService: PostService) {
    this.logger.setContext(PublicService.name);
  }

  getAllPublicPosts() {
    return this.postService.publicList();
  }

  getPublicPostById(post: Posts) {
    return this.postService.publicRead(post);
  }
}
