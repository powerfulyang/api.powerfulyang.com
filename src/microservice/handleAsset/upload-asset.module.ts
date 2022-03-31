import { Module } from '@nestjs/common';
import { HelloController } from '@/microservice/hello/hello.controller';
import { UploadAssetController } from './upload-asset.controller';
import { BucketModule } from '@/modules/bucket/bucket.module';
import { TencentCloudAccountModule } from '@/modules/tencent-cloud-account/tencent-cloud-account.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { OrmModule } from '@/common/ORM/orm.module';
import { AssetModule } from '@/modules/asset/asset.module';

@Module({
  imports: [OrmModule, BucketModule, TencentCloudAccountModule, LoggerModule, AssetModule],
  controllers: [UploadAssetController, HelloController],
})
export class UploadAssetModule {}
