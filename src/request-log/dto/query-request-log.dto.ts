import { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { RequestLog } from '@/request-log/entities/request-log.entity';
import { ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger';

export class QueryRequestLogDto extends IntersectionType(
  PaginatedBaseQuery,
  OmitType(RequestLog, ['createdAt', 'updatedAt']),
) {
  @ApiProperty({
    description: '创建时间',
    type: [Date, Date],
  })
  createdAt: [Date, Date];

  @ApiProperty({
    description: '更新时间',
    type: [Date, Date],
  })
  updatedAt: [Date, Date];
}
