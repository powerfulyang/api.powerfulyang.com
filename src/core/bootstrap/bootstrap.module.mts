import { Module } from '@nestjs/common';
import { UserModule } from '@/modules/user/user.module.mjs';
import { SchedulesModule } from '@/schedules/schedules.module.mjs';
import { PathViewCountModule } from '@/modules/path-ip-view-count/path-view-count.module.mjs';
import { BootstrapService } from '@/core/bootstrap/bootstrap.service.mjs';
import { BucketModule } from '@/modules/bucket/bucket.module.mjs';

@Module({
  imports: [UserModule, SchedulesModule, PathViewCountModule, BucketModule],
  providers: [BootstrapService],
  exports: [BootstrapService],
})
export class BootstrapModule {}
