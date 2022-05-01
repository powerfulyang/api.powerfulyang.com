import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CosBucket } from '@/modules/bucket/entities/bucket.entity';

export class CreateBucketDto extends PartialType(CosBucket) {
  @IsNotEmpty()
  declare name: string;

  @IsNotEmpty()
  declare Region: string;

  @IsNotEmpty()
  declare tencentCloudAccount: CosBucket['tencentCloudAccount'];
}
