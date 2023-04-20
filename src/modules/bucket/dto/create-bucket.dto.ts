import { CosBucket } from '@/modules/bucket/entities/bucket.entity';
import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBucketDto extends PartialType(CosBucket) {
  @IsNotEmpty()
  declare name: string;

  @IsNotEmpty()
  declare Region: string;

  @IsNotEmpty()
  declare tencentCloudAccount: CosBucket['tencentCloudAccount'];
}
