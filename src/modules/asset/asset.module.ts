import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '@/entity/asset.entity';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Asset])],
    providers: [AssetService],
    controllers: [AssetController],
})
export class AssetModule {}
