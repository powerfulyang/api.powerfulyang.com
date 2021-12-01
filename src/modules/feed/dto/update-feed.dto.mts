import { PartialType } from '@nestjs/mapped-types';
import { CreateFeedDto } from './create-feed.dto.mjs';

export class UpdateFeedDto extends PartialType(CreateFeedDto) {}
