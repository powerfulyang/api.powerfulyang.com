import { Module } from '@nestjs/common';
import { UserModule } from '@/modules/user/user.module';
import { SchedulesModule } from '@/schedules/schedules.module';
import { PathViewCountModule } from '@/modules/path-ip-view-count/path-view-count.module';
import { BootstrapService } from '@/core/bootstrap/bootstrap.service';
import { BucketModule } from '@/modules/bucket/bucket.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { CoreModule } from '@/core/core.module';

@Module({
  imports: [
    UserModule,
    SchedulesModule,
    PathViewCountModule,
    BucketModule,
    LoggerModule,
    CoreModule,
  ],
  providers: [BootstrapService],
  exports: [BootstrapService],
})
export class BootstrapModule {}
