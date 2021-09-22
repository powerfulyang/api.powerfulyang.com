import { Body, Controller, Delete, Get, Param, Post, UploadedFiles } from '@nestjs/common';
import { AssetService } from '@/modules/asset/asset.service';
import { Pagination } from '@/common/decorator/pagination.decorator';
import { ImagesInterceptor } from '@/common/interceptor/images.file.upload.interceptor';
import type { UploadFile } from '@/type/UploadFile';
import { AdminAuthGuard, JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { AssetBucket } from '@/enum/AssetBucket';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';

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

  @Get('sync')
  @AdminAuthGuard()
  syncAllFromCos() {
    return this.assetService.syncFromCos();
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
  saveAsset(@UploadedFiles() files: UploadFile[], @UserFromAuth() user: User) {
    return this.assetService.saveAssetToBucket(files, AssetBucket.upload, user);
  }

  @Post(':bucketName')
  @ImagesInterceptor()
  saveAssetToBucket(
    @UploadedFiles() files: UploadFile[],
    @Param('bucketName') bucketName: AssetBucket,
    @UserFromAuth() user: User,
  ) {
    return this.assetService.saveAssetToBucket(files, bucketName, user);
  }

  @Delete()
  @AdminAuthGuard()
  deleteAsset(@Body('id') id: number, @Body('ids') ids: number[]) {
    return this.assetService.deleteAsset(ids || [id]);
  }
}
