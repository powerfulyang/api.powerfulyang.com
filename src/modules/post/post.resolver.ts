import { LoggerService } from '@/common/logger/logger.service';
import { CreatePostDto } from '@/modules/post/dto/create-post.dto';
import { Post } from '@/modules/post/entities/post.entity';
import { PostService } from '@/modules/post/post.service';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService, private readonly logger: LoggerService) {
    this.logger.setContext(PostResolver.name);
  }

  @Query(() => Post)
  post(
    @Args('id', {
      type: () => ID,
    })
    id: number,
  ) {
    return this.postService.readPost(id);
  }

  @Mutation(() => Post)
  createPost(@Args('input') input: CreatePostDto) {
    return this.postService.createPost(input);
  }
}
