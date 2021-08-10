import { Body, Controller, Delete, Get, Post, UploadedFiles } from '@nestjs/common';
import { AssetService } from '@/modules/asset/asset.service';
import { Pagination } from '@/common/decorator/pagination.decorator';
import { ImagesInterceptor } from '@/common/interceptor/images.file.upload.interceptor';
import { UploadFile } from '@/type/UploadFile';
import { JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { PathViewCount } from '@/common/decorator/path-view-count.decorator';

@Controller('asset')
@JwtAuthGuard()
export class AssetController {
  constructor(private assetService: AssetService) {}

  @Get()
  @PathViewCount()
  list(@Pagination() pagination: Pagination) {
    return this.assetService.list(pagination);
  }

  @Get('all')
  @PathViewCount()
  all() {
    return this.assetService.all();
  }

  @Get('pHash/distance')
  @PathViewCount()
  async pHashMap() {
    return this.assetService.pHashMap();
  }

  @Post()
  @ImagesInterceptor()
  saveAsset(@UploadedFiles() files: UploadFile[]) {
    return this.assetService.saveAsset(files);
  }

  @Delete()
  deleteAsset(@Body('id') id: number) {
    return this.assetService.deleteAsset(id);
  }
}
