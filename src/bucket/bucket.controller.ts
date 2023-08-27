import { BucketBackupService } from '@/bucket/bucket.backup/bucket.backup.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { BucketService } from '@/bucket/bucket.service';
import { CreateBucketDto } from '@/bucket/dto/create-bucket.dto';

@Controller('bucket')
@AdminAuthGuard()
@ApiTags('bucket')
export class BucketController {
  constructor(
    private readonly bucketService: BucketService,
    private readonly bucketBackupService: BucketBackupService,
  ) {}

  @Get()
  listAllBuckets() {
    return this.bucketService.all();
  }

  @Post()
  createNewBucket(@Body() bucket: CreateBucketDto) {
    return this.bucketService.createNewBucket(bucket);
  }

  @Get('backup/:accountId')
  backup(@Param('accountId') accountId: string) {
    return this.bucketBackupService.backup(accountId);
  }
}
