import { Body, Controller, Delete, Get, Param, Post, UploadedFiles } from '@nestjs/common';
import { AssetService } from '@/modules/asset/asset.service';
import { ImagesInterceptor } from '@/common/interceptor/images.file.upload.interceptor';
import type { UploadFile } from '@/type/UploadFile';
import { AdminAuthGuard, JwtAuthGuard } from '@/common/decorator';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';
import type { CosBucket } from '@/modules/bucket/entities/bucket.entity';

@Controller('asset')
@AdminAuthGuard() // 2nd
@JwtAuthGuard() // 1st
export class AssetController {
  constructor(private assetService: AssetService) {}

  @Get('sync')
  syncAllFromCos() {
    return this.assetService.syncFromCos();
  }

  @Get('pHash/distance')
  async pHashMap() {
    return this.assetService.pHashMap();
  }

  @Post(':bucketName')
  @ImagesInterceptor()
  saveAssetToBucket(
    @UploadedFiles() files: UploadFile[],
    @Param('bucketName') bucketName: CosBucket['name'],
    @UserFromAuth() user: User,
  ) {
    return this.assetService.saveAssetToBucket(files, bucketName, user);
  }

  @Delete()
  deleteAsset(@Body('id') id: number, @Body('ids') ids: number[]) {
    return this.assetService.deleteAsset(ids || [id]);
  }
}
