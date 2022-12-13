import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AssetService } from '@/modules/asset/asset.service';
import type { UploadFile } from '@/type/UploadFile';
import { UploadAssetsDto } from '@/type/UploadFile';
import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { AuthUser } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@Controller('asset')
@AdminAuthGuard()
@ApiTags('asset')
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadAssetsDto,
  })
  saveAssetToBucket(
    @Body('assets') files: UploadFile[],
    @Body('files') files_compatible: UploadFile[],
    @Param('bucketName') bucketName: string,
    @AuthUser() user: User,
  ) {
    return this.assetService.saveAssetToBucket(files || files_compatible, bucketName, user);
  }

  @Delete()
  deleteAsset(@Body('id') id: number, @Body('ids') ids: number[]) {
    return this.assetService.deleteAsset(ids || [id]);
  }
}
