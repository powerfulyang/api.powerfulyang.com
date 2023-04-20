import { CacheModule } from '@/common/cache/cache.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { Module } from '@nestjs/common';
import { CoreService } from './core.service';

@Module({
  imports: [CacheModule, LoggerModule],
  providers: [CoreService],
  exports: [CoreService],
})
export class CoreModule {}
