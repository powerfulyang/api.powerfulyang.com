import { Module } from '@nestjs/common';
import { UploadAssetController } from './upload-asset.controller';
import { LoggerModule } from '@/common/logger/logger.module';
import { AssetModule } from '@/modules/asset/asset.module';

@Module({
  imports: [LoggerModule, AssetModule],
  controllers: [UploadAssetController],
})
export class UploadAssetModule {}
