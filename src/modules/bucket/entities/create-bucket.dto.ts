import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { BucketRegion } from '@powerfulyang/cos-nodejs-sdk-v5';
import { CosBucket } from '@/modules/bucket/entities/bucket.entity';

export class CreateBucketDto extends PartialType(CosBucket) {
  @IsNotEmpty()
  declare name: string;

  @IsNotEmpty()
  declare Region: BucketRegion;

  @IsNotEmpty()
  declare tencentCloudAccount: CosBucket['tencentCloudAccount'];
}
