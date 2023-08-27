import { Module } from '@nestjs/common';
import { CacheModule } from '@/common/cache/cache.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { BootstrapService } from '@/core/bootstrap/bootstrap.service';
import { CoreModule } from '@/core/core.module';
import { BucketModule } from '@/bucket/bucket.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [UserModule, BucketModule, LoggerModule, CoreModule, CacheModule],
  providers: [BootstrapService],
  exports: [BootstrapService],
})
export class BootstrapModule {}
