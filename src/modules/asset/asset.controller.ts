import { Body, Controller, Delete, Get, Param, Post, UploadedFiles } from '@nestjs/common';
import { AssetService } from '@/modules/asset/asset.service';
import { Pagination } from '@/common/decorator/pagination.decorator';
import { ImagesInterceptor } from '@/common/interceptor/images.file.upload.interceptor';
import { UploadFile } from '@/type/UploadFile';
import { JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { AssetBucket } from '@/enum/AssetBucket';

@Controller('asset')
@JwtAuthGuard()
export class AssetController {
  constructor(private assetService: AssetService) {}

  @Get()
  list(@Pagination() pagination: Pagination) {
    return this.assetService.list(pagination);
  }

  @Get('all')
  all() {
    return this.assetService.all();
  }

  @Get(':id')
  getAssetById(@Param('id') id: string) {
    return this.assetService.findById(+id);
  }

  @Get('pHash/distance')
  async pHashMap() {
    return this.assetService.pHashMap();
  }

  @Post()
  @ImagesInterceptor()
  saveAsset(@UploadedFiles() files: UploadFile[]) {
    return this.assetService.saveAsset(files);
  }

  @Post(':bucketName')
  @ImagesInterceptor()
  saveAssetToBucket(
    @UploadedFiles() files: UploadFile[],
    @Param('bucketName') bucketName: AssetBucket,
  ) {
    return this.assetService.saveAssetToBucket(files, bucketName);
  }

  @Delete()
  deleteAsset(@Body('id') id: number, @Body('ids') ids: number[]) {
    return this.assetService.deleteAsset(ids || [id]);
  }
}
