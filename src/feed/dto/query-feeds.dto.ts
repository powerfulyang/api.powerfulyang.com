import { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { Feed } from '@/feed/entities/feed.entity';
import { IntersectionType, PickType } from '@nestjs/swagger';

export class QueryFeedsDto extends IntersectionType(PaginatedBaseQuery, PickType(Feed, ['id'])) {}
