import { Query, Resolver } from '@nestjs/graphql';
import { Post } from '@/post/entities/post.entity';
import { PostService } from '@/post/post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => Post)
  post() {
    return this.postService.readPost(101);
  }
}
