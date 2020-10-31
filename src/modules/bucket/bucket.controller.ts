import { Controller, Get } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { BucketService } from '@/modules/bucket/bucket.service';

@Controller('bucket')
@JwtAuthGuard()
export class BucketController {
    constructor(private readonly bucketService: BucketService) {}

    @Get()
    list() {
        return this.bucketService.list();
    }
}
