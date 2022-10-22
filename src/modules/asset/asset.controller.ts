import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AssetService } from '@/modules/asset/asset.service';
import type { UploadFile } from '@/type/UploadFile';
import { AdminAuthGuard } from '@/common/decorator';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';
import type { CosBucket } from '@/modules/bucket/entities/bucket.entity';

@Controller('asset')
@AdminAuthGuard() // 2nd
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
  saveAssetToBucket(
    @Body('files') files: UploadFile[],
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
