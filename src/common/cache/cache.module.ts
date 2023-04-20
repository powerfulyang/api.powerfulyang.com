import { CacheService } from '@/common/cache/cache.service';
import { ConfigModule } from '@/common/config/config.module';
import { ConfigService } from '@/common/config/config.service';
import { LoggerModule } from '@/common/logger/logger.module';
import { REDIS_CONFIG } from '@/constants/PROVIDER_TOKEN';
import { Module } from '@nestjs/common';

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
