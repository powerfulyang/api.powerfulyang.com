import { Module } from '@nestjs/common';
import { TencentCloudCosModule } from 'api/tencent-cloud-cos';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bucket } from '@/entity/bucket.entity';
import { BucketService } from './bucket.service';
import { BucketController } from './bucket.controller';

@Module({
  imports: [TencentCloudCosModule, TypeOrmModule.forFeature([Bucket])],
  providers: [BucketService],
  controllers: [BucketController],
})
export class BucketModule {}
