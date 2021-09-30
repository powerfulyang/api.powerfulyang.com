import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '@/modules/asset/entities/asset.entity';
import { HelloController } from '@/microservice/hello/hello.controller';
import { UploadAssetController } from './upload-asset.controller';
import { UploadAssetService } from './upload-asset.service';
import { BucketModule } from '@/modules/bucket/bucket.module';
import { TencentCloudAccountModule } from '@/modules/tencent-cloud-account/tencent-cloud-account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Asset]), BucketModule, TencentCloudAccountModule],
  controllers: [UploadAssetController, HelloController],
  providers: [UploadAssetService],
  exports: [UploadAssetService],
})
export class UploadAssetModule {}
