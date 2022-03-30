import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PixivBotModule } from 'api/pixiv-bot';
import { InstagramBotModule } from 'api/instagram-bot';
import { PinterestBotModule } from 'api/pinterest-bot';
import { Asset } from '@/modules/asset/entities/asset.entity';
import { BucketModule } from '@/modules/bucket/bucket.module';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { UploadAssetModule } from '@/microservice/handleAsset/upload-asset.module';
import { TencentCloudAccountModule } from '@/modules/tencent-cloud-account/tencent-cloud-account.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset]),
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
