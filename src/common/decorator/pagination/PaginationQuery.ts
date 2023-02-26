import { ApiProperty } from '@nestjs/swagger';

export class PaginatedBaseQuery {
  @ApiProperty({
    name: 'pageSize',
    description: '每页条数',
    type: Number,
  })
  public readonly take: number;

  @ApiProperty({
    name: 'current',
    description: '当前页码',
    type: Number,
  })
  skip: number;
}
