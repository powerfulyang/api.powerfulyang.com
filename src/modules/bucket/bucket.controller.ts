import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminAuthGuard } from '@/common/decorator/auth-guard';
import { BucketService } from '@/modules/bucket/bucket.service';
import { CreateBucketDto } from '@/modules/bucket/entities/create-bucket.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('bucket')
@AdminAuthGuard()
@ApiTags('bucket')
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
