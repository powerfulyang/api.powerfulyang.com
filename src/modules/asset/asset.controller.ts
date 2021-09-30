import { Body, Controller, Delete, Get, Param, Post, UploadedFiles } from '@nestjs/common';
import { AssetService } from '@/modules/asset/asset.service';
import { Pagination } from '@/common/decorator/pagination.decorator';
import { ImagesInterceptor } from '@/common/interceptor/images.file.upload.interceptor';
import type { UploadFile } from '@/type/UploadFile';
import { AdminAuthGuard, JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { FamilyMembersFromAuth, UserFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/modules/user/entities/user.entity';
import type { CosBucket } from '@/modules/bucket/entities/bucket.entity';

@Controller('asset')
@JwtAuthGuard()
export class AssetController {
  constructor(private assetService: AssetService) {}

  @Get()
  list(@Pagination() pagination: Pagination, @FamilyMembersFromAuth() users: User[]) {
    return this.assetService.listUsersAsset(pagination, users);
  }

  @Get('all')
  @AdminAuthGuard()
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
  @AdminAuthGuard()
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
  @AdminAuthGuard()
  deleteAsset(@Body('id') id: number, @Body('ids') ids: number[]) {
    return this.assetService.deleteAsset(ids || [id]);
  }
}
