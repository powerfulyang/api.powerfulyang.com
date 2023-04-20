import { CacheModule } from '@/common/cache/cache.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { BootstrapService } from '@/core/bootstrap/bootstrap.service';
import { CoreModule } from '@/core/core.module';
import { BucketModule } from '@/modules/bucket/bucket.module';
import { PathViewCountModule } from '@/modules/path-view-count/path-view-count.module';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UserModule, PathViewCountModule, BucketModule, LoggerModule, CoreModule, CacheModule],
  providers: [BootstrapService],
  exports: [BootstrapService],
})
export class BootstrapModule {}
