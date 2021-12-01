import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '@/modules/asset/entities/asset.entity.mjs';
import { HelloController } from '@/microservice/hello/hello.controller.mjs';
import { UploadAssetController } from './upload-asset.controller.mjs';
import { UploadAssetService } from './upload-asset.service.mjs';
import { BucketModule } from '@/modules/bucket/bucket.module.mjs';
import { TencentCloudAccountModule } from '@/modules/tencent-cloud-account/tencent-cloud-account.module.mjs';

@Module({
  imports: [TypeOrmModule.forFeature([Asset]), BucketModule, TencentCloudAccountModule],
  controllers: [UploadAssetController, HelloController],
  providers: [UploadAssetService],
  exports: [UploadAssetService],
})
export class UploadAssetModule {}
