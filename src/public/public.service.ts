import { Injectable } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger';
import { PostService } from '@/modules/post/post.service';
import { Posts } from '@/entity/posts.entity';
import { countBy, flatten, map, prop, trim } from 'ramda';
import { CoreService } from '@/core/core.service';
import { COMMON_CODE_UUID } from '@/utils/uuid';

@Injectable()
export class PublicService {
  constructor(
    private logger: AppLogger,
    private postService: PostService,
    private coreService: CoreService,
  ) {
    this.logger.setContext(PublicService.name);
  }

  getAllPublicPosts() {
    return this.postService.publicList();
  }

  getPublicPostById(post: Posts) {
    return this.postService.publicRead(post);
  }

  async postsTags() {
    const tagsArr = await this.postService.tagsArray();
    const allTags = flatten(map(prop('tags'), tagsArr));
    return countBy(trim)(allTags);
  }

  isCommonNode() {
    return this.coreService.isCommonNode();
  }
}
