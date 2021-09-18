import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '@/modules/asset/entities/asset.entity';
import { TencentCloudCosModule } from 'api/tencent-cloud-cos';
import { BucketModule } from '@/modules/bucket/bucket.module';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Asset]), TencentCloudCosModule, BucketModule],
  providers: [AssetService],
  controllers: [AssetController],
  exports: [AssetService],
})
export class AssetModule {}
