import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '@/entity/asset.entity';
import { TencentCloudCosModule } from 'api/tencent-cloud-cos';
import { Bucket } from '@/entity/bucket.entity';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, Bucket]), TencentCloudCosModule],
  providers: [AssetService],
  controllers: [AssetController],
  exports: [AssetService],
})
export class AssetModule {}
