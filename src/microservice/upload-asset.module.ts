import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '@/entity/asset.entity';
import { TencentCloudCosModule } from 'api/tencent-cloud-cos';
import { UploadAssetController } from './upload-asset.controller';
import { UploadAssetService } from './upload-asset.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Asset]),
        TencentCloudCosModule,
    ],
    controllers: [UploadAssetController],
    providers: [UploadAssetService],
})
export class UploadAssetModule {}
