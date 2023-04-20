import { Post } from '@/modules/post/entities/post.entity';
import { PostService } from '@/modules/post/post.service';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => Post)
  post() {
    return this.postService.readPost(101);
  }
}
