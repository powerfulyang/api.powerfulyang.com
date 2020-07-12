import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticResource } from '../entity/static.entity';
import { UploadStaticController } from './upload-static.controller';

@Module({
    imports: [TypeOrmModule.forFeature([StaticResource])],
    controllers: [UploadStaticController],
})
export class UploadStaticModule {}
