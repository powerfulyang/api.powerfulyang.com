import { PartialType } from '@nestjs/mapped-types';
import { Post } from '@/modules/post/entities/post.entity.mjs';

export class PublishPostDto extends PartialType(Post) {}
