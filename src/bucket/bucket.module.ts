import { OrmModule } from '@/service/typeorm/orm.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@/common/logger/logger.module';
import { CosBucket } from '@/bucket/entities/bucket.entity';
import { TencentCloudAccountModule } from '@/tencent-cloud-account/tencent-cloud-account.module';
import { BucketController } from './bucket.controller';
import { BucketService } from './bucket.service';
import { BucketBackupService } from './bucket.backup/bucket.backup.service';

@Module({
  imports: [
    OrmModule,
    TencentCloudAccountModule,
    TypeOrmModule.forFeature([CosBucket]),
    LoggerModule,
  ],
  providers: [BucketService, BucketBackupService],
  controllers: [BucketController],
  exports: [BucketService],
})
export class BucketModule {}
