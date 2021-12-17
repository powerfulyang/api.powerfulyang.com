import { Module } from '@nestjs/common';
import { ConfigModule } from '@/core/config/config.module';
import { CacheService } from '@/core/cache/cache.service';

@Module({
  imports: [ConfigModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
