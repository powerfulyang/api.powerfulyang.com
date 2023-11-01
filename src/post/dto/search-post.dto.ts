import { InfiniteQueryRequest } from '@/type/InfiniteQueryRequest';
import { ApiProperty } from '@nestjs/swagger';

export class SearchPostDto extends InfiniteQueryRequest {
  @ApiProperty()
  declare publishYear?: number;
}
