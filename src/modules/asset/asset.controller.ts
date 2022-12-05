import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AssetService } from '@/modules/asset/asset.service';
import type { UploadFile } from '@/type/UploadFile';
import { UploadFilesDto } from '@/type/UploadFile';
import { AdminAuthGuard } from '@/common/decorator/auth-guard';
import { UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
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
    type: UploadFilesDto,
  })
  saveAssetToBucket(
    @Body('assets') files: UploadFile[],
    @Body('files') files_compatible: UploadFile[],
    @Param('bucketName') bucketName: string,
    @UserFromAuth() user: User,
  ) {
    return this.assetService.saveAssetToBucket(files || files_compatible, bucketName, user);
  }

  @Delete()
  deleteAsset(@Body('id') id: number, @Body('ids') ids: number[]) {
    return this.assetService.deleteAsset(ids || [id]);
  }
}
