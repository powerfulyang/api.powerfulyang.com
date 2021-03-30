import { Body, Controller, Get, Post } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { BucketService } from '@/modules/bucket/bucket.service';
import { Bucket } from '@/entity/bucket.entity';

@Controller('bucket')
@JwtAuthGuard()
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  @Get()
  list() {
    return this.bucketService.list();
  }

  @Post()
  createBucket(@Body() bucket: Bucket) {
    return this.bucketService.createBucket(bucket);
  }
}
