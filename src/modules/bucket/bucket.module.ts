import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CosBucket } from '@/modules/bucket/entities/bucket.entity';
import { BucketService } from './bucket.service';
import { BucketController } from './bucket.controller';
import { TencentCloudAccountModule } from '@/modules/tencent-cloud-account/tencent-cloud-account.module';

@Module({
  imports: [TencentCloudAccountModule, TypeOrmModule.forFeature([CosBucket])],
  providers: [BucketService],
  controllers: [BucketController],
  exports: [BucketService],
})
export class BucketModule {}
