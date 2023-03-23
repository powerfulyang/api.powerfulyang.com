import { ApiPropertyOptional } from '@nestjs/swagger';

export class InfiniteQueryRequest {
  @ApiPropertyOptional()
  prevCursor?: string;

  @ApiPropertyOptional()
  nextCursor?: string;

  @ApiPropertyOptional()
  take?: number;
}
