import { IntersectionType, PickType } from '@nestjs/swagger';
import { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { Feed } from '@/feed/entities/feed.entity';

export class QueryFeedsDto extends IntersectionType(PaginatedBaseQuery, PickType(Feed, ['id'])) {}
