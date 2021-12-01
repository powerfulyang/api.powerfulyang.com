import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CosBucket } from '@/modules/bucket/entities/bucket.entity.mjs';
import { BucketService } from './bucket.service.mjs';
import { BucketController } from './bucket.controller.mjs';
import { TencentCloudAccountModule } from '@/modules/tencent-cloud-account/tencent-cloud-account.module.mjs';

@Module({
  imports: [TencentCloudAccountModule, TypeOrmModule.forFeature([CosBucket])],
  providers: [BucketService],
  controllers: [BucketController],
  exports: [BucketService],
})
export class BucketModule {}
