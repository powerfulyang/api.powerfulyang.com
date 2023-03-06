import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { PaginatedBaseQuery } from '@/common/decorator/pagination/PaginationQuery';
import { Asset } from '@/modules/asset/entities/asset.entity';

export class QueryAssetsDto extends IntersectionType(
  PaginatedBaseQuery,
  PickType(Asset, ['id', 'sha1']),
) {
  @ApiProperty()
  createAt?: [Date, Date];

  @ApiProperty()
  updateAt?: [Date, Date];
}
