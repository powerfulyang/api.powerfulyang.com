import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { Asset } from '@/modules/asset/entities/asset.entity';

export class QueryAssetsDto extends IntersectionType(
  PaginatedBaseQuery,
  PickType(Asset, ['id', 'sha1', 'originUrl']),
) {
  @ApiProperty({
    type: [Date, Date],
  })
  createAt?: [Date, Date];

  @ApiProperty({
    type: [Date, Date],
  })
  updateAt?: [Date, Date];
}
