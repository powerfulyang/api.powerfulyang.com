import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PixivBotModule } from 'api/pixiv-bot';
import { InstagramBotModule } from 'api/instagram-bot';
import { PinterestRssModule } from 'api/pinterest-rss';
import { Asset } from '@/modules/asset/entities/asset.entity';
import { BucketModule } from '@/modules/bucket/bucket.module';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { CosBucket } from '@/modules/bucket/entities/bucket.entity';
import { UploadAssetModule } from '@/microservice/handleAsset/upload-asset.module';
import { TencentCloudAccountModule } from '@/modules/tencent-cloud-account/tencent-cloud-account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, CosBucket]),
    BucketModule,
    PixivBotModule,
    InstagramBotModule,
    PinterestRssModule,
    UploadAssetModule,
    TencentCloudAccountModule,
  ],
  providers: [AssetService],
  controllers: [AssetController],
  exports: [AssetService],
})
export class AssetModule {}
