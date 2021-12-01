import { PartialType } from '@nestjs/mapped-types';
import { Feed } from '@/modules/feed/entities/feed.entity.mjs';

export class CreateFeedDto extends PartialType(Feed) {}
