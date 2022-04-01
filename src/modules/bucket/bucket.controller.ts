import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminAuthGuard, JwtAuthGuard } from '@/common/decorator';
import { BucketService } from '@/modules/bucket/bucket.service';
import { CreateBucketDto } from '@/modules/bucket/entities/create-bucket.dto';

@Controller('bucket')
@AdminAuthGuard()
@JwtAuthGuard()
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  @Get()
  listAllBuckets() {
    return this.bucketService.all();
  }

  @Post()
  createNewBucket(@Body() bucket: CreateBucketDto) {
    return this.bucketService.createNewBucket(bucket);
  }
}
