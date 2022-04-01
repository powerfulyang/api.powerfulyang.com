import { Module } from '@nestjs/common';
import { ConfigModule } from '@/common/config/config.module';
import { CacheService } from '@/common/cache/cache.service';
import { LoggerModule } from '@/common/logger/logger.module';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
