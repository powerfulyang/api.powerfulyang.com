import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticResource } from '@/entity/asset.entity';
import { UploadStaticController } from './upload-static.controller';
import { UploadStaticService } from './upload-static.service';

@Module({
    imports: [TypeOrmModule.forFeature([StaticResource])],
    controllers: [UploadStaticController],
    providers: [UploadStaticService],
})
export class UploadStaticModule {}
