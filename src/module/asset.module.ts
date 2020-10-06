import { Module } from '@nestjs/common';
import { AssetService } from '@/service/asset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '@/entity/asset.entity';
import { Bucket } from '@/entity/bucket.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Asset, Bucket])],
    providers: [AssetService],
    controllers: [],
})
export class AssetModule {}
