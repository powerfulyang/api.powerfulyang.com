import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PixivBotModule } from 'api/pixiv-bot/index.mjs';
import { InstagramBotModule } from 'api/instagram-bot/index.mjs';
import { PinterestBotModule } from 'api/pinterest-bot/index.mjs';
import { Asset } from '@/modules/asset/entities/asset.entity.mjs';
import { BucketModule } from '@/modules/bucket/bucket.module.mjs';
import { AssetService } from './asset.service.mjs';
import { AssetController } from './asset.controller.mjs';
import { CosBucket } from '@/modules/bucket/entities/bucket.entity.mjs';
import { UploadAssetModule } from '@/microservice/handleAsset/upload-asset.module.mjs';
import { TencentCloudAccountModule } from '@/modules/tencent-cloud-account/tencent-cloud-account.module.mjs';
import { UserModule } from '@/modules/user/user.module.mjs';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, CosBucket]),
    BucketModule,
    PixivBotModule,
    InstagramBotModule,
    PinterestBotModule,
    UploadAssetModule,
    TencentCloudAccountModule,
    UserModule,
  ],
  providers: [AssetService],
  controllers: [AssetController],
  exports: [AssetService],
})
export class AssetModule {}
