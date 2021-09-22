import { Injectable } from '@nestjs/common';
import { countBy, flatten, map, prop, trim } from 'ramda';
import { AppLogger } from '@/common/logger/app.logger';
import { PostService } from '@/modules/post/post.service';
import type { Post } from '@/modules/post/entities/post.entity';
import { CoreService } from '@/core/core.service';
import { FeedService } from '@/modules/feed/feed.service';

@Injectable()
export class PublicService {
  constructor(
    private logger: AppLogger,
    private postService: PostService,
    private coreService: CoreService,
    private readonly feedService: FeedService,
  ) {
    this.logger.setContext(PublicService.name);
  }

  getAllPublicPost(query: Post) {
    return this.postService.publicList(query);
  }

  getPublicPostById(post: Post) {
    return this.postService.publicRead(post);
  }

  async getPublicPostTags() {
    const tagsArr = await this.postService.tagsArray(true);
    const allTags = flatten(map(prop('tags'), tagsArr));
    return countBy(trim)(allTags);
  }

  isCommonNode() {
    return this.coreService.isCommonNode();
  }

  async getAllPublicFeed() {
    return this.feedService.publicList();
  }

  getPublishedYears() {
    return this.postService.publicPublishedYears();
  }
}
