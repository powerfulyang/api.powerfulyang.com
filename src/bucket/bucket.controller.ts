import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { BucketService } from '@/bucket/bucket.service';
import { CreateBucketDto } from '@/bucket/dto/create-bucket.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
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
