import { Controller, Get, Post, UploadedFiles } from '@nestjs/common';
import { AssetService } from '@/modules/asset/asset.service';
import { Pagination } from '@/common/decorator/pagination.decorator';
import { ImagesInterceptor } from '@/common/interceptor/images.file.upload.interceptor';
import { UploadFile } from '@/type/UploadFile';
import {JwtAuthGuard} from "@/common/decorator/auth-guard.decorator";

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

  @Get('pHash/distance')
  async pHashMap() {
    return this.assetService.pHashMap();
  }

  @Post()
  @ImagesInterceptor()
  saveAsset(@UploadedFiles() files: UploadFile[]) {
    return this.assetService.saveAsset(files);
  }
}
