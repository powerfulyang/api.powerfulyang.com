import { LoggerModule } from '@/common/logger/logger.module';
import { CosBucket } from '@/bucket/entities/bucket.entity';
import { TencentCloudAccountModule } from '@/tencent-cloud-account/tencent-cloud-account.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BucketController } from './bucket.controller';
import { BucketService } from './bucket.service';

@Module({
  imports: [TencentCloudAccountModule, TypeOrmModule.forFeature([CosBucket]), LoggerModule],
  providers: [BucketService],
  controllers: [BucketController],
  exports: [BucketService],
})
export class BucketModule {}
