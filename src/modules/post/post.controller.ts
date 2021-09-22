import { Body, Controller, Delete, Get, Param, Post as PostDecorator, Query } from '@nestjs/common';
import { pluck } from 'ramda';
import { PostService } from '@/modules/post/post.service';
import { AdminAuthGuard, JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { FamilyMembersFromAuth, UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';
import { PostDto } from '@/modules/user/dto/PostDto';
import { Post } from '@/modules/post/entities/post.entity';

@Controller('post')
@JwtAuthGuard()
export class PostController {
  constructor(private postService: PostService) {}

  @PostDecorator()
  createPost(@Body() draft: PostDto, @UserFromAuth(['id']) user: User) {
    draft.createBy = user;
    return this.postService.publishPost(draft);
  }

  @Get()
  getAll(@FamilyMembersFromAuth() users: User[], @Query() post: Post) {
    return this.postService.getAllPostByUserIds(pluck('id', users), post);
  }

  @Get('years')
  getPublishedYears(@FamilyMembersFromAuth() users: User[]) {
    return this.postService.getPublishedYears(pluck('id', users));
  }

  @Get('tags')
  getPublishedTags(@FamilyMembersFromAuth() users: User[]) {
    return this.postService.getPublishedTags(pluck('id', users));
  }

  @Get()
  @Get(':id')
  get(@Param() draft: Post, @UserFromAuth(['id']) user: User) {
    draft.createBy = user;
    return this.postService.get(draft);
  }

  @Delete(':id')
  @AdminAuthGuard()
  deletePost(@Param() draft: Post, @UserFromAuth(['id']) user: User) {
    draft.createBy = user;
    return this.postService.deletePost(draft);
  }
}
