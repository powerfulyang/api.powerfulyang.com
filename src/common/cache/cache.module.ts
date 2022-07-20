import { Module } from '@nestjs/common';
import { ConfigModule } from '@/common/config/config.module';
import { CacheService } from '@/common/cache/cache.service';
import { LoggerModule } from '@/common/logger/logger.module';
import { REDIS_CONFIG } from '@/constants/PROVIDER_TOKEN';
import { ConfigService } from '@/common/config/config.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [
    CacheService,
    {
      provide: REDIS_CONFIG,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.getRedisConfig(),
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
