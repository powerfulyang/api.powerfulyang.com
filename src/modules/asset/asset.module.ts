import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TencentCloudCosModule } from 'api/tencent-cloud-cos';
import { PixivBotModule } from 'api/pixiv-bot';
import { InstagramBotModule } from 'api/instagram-bot';
import { PinterestRssModule } from 'api/pinterest-rss';
import { Asset } from '@/modules/asset/entities/asset.entity';
import { BucketModule } from '@/modules/bucket/bucket.module';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { Bucket } from '@/modules/bucket/entities/bucket.entity';
import { UploadAssetModule } from '@/microservice/handleAsset/upload-asset.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, Bucket]),
    TencentCloudCosModule,
    BucketModule,
    PixivBotModule,
    InstagramBotModule,
    PinterestRssModule,
    UploadAssetModule,
  ],
  providers: [AssetService],
  controllers: [AssetController],
  exports: [AssetService],
})
export class AssetModule {}
