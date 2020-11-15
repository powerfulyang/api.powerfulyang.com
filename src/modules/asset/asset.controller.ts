import { Controller, Get } from '@nestjs/common';
import { AssetService } from '@/modules/asset/asset.service';
import { Pagination } from '@/common/decorator/pagination.decorator';

@Controller('asset')
export class AssetController {
  constructor(private assetService: AssetService) {}

  @Get()
  list(@Pagination() pagination: Pagination) {
    return this.assetService.list(pagination);
  }

  @Get('pHash/distance')
  async pHashMap() {
    return this.assetService.pHashMap();
  }
}
