import { Body, Controller, Get, Post } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/decorator/auth-guard.decorator.mjs';
import { BucketService } from '@/modules/bucket/bucket.service.mjs';
import { CosBucket } from '@/modules/bucket/entities/bucket.entity.mjs';

@Controller('bucket')
@JwtAuthGuard()
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  @Get()
  list() {
    return this.bucketService.list();
  }

  @Post()
  createBucket(@Body() bucket: CosBucket) {
    return this.bucketService.createBucket(bucket);
  }
}
