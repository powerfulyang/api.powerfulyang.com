import { Module } from '@nestjs/common';
import { TencentCloudCosModule } from 'api/tencent-cloud-cos';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bucket } from '@/modules/bucket/entities/bucket.entity';
import { BucketService } from './bucket.service';
import { BucketController } from './bucket.controller';

@Module({
  imports: [TencentCloudCosModule, TypeOrmModule.forFeature([Bucket])],
  providers: [BucketService],
  controllers: [BucketController],
  exports: [BucketService],
})
export class BucketModule {}
