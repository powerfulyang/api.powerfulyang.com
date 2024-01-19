import { LoggerModule } from '@/common/logger/logger.module';
import { S3Service } from '@/libs/s3/s3.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [LoggerModule],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
