import type { Provider } from '@nestjs/common';
import { CacheModule, Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { Asset } from '@/modules/asset/entities/asset.entity.mjs';
import { CosBucket } from '@/modules/bucket/entities/bucket.entity.mjs';
import { SearchService } from '@/core/search/search.service.mjs';
import { MICROSERVICE_NAME } from '@/constants/constants.mjs';
import { Feed } from '@/modules/feed/entities/feed.entity.mjs';
import { CoreService } from './core.service.mjs';
import { CacheService } from './cache/cache.service.mjs';
import { OauthApplicationModule } from '@/modules/oauth-application/oauth-application.module.mjs';
import { OauthApplicationService } from '@/modules/oauth-application/oauth-application.service.mjs';
import { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity.mjs';
import { JWT_SECRET, OAUTH_APPLICATION_STRATEGY_CONFIG } from '@/constants/PROVIDER_TOKEN.mjs';
import { ConfigModule } from './config/config.module.mjs';
import { ConfigService } from '@/core/config/config.service.mjs';

const OauthApplicationConfigProvider: Provider = {
  provide: OAUTH_APPLICATION_STRATEGY_CONFIG,
  inject: [OauthApplicationService],
  useFactory: async (oauthApplicationService: OauthApplicationService) => {
    const googleConfig = await oauthApplicationService.getGoogle();
    return {
      [SupportOauthApplication.google]: googleConfig,
    };
  },
};

const JwtConfigProvider: Provider = {
  provide: JWT_SECRET,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => configService.getJwtSecret(),
};

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getPostgreConfig();
      },
    }),
    ClientsModule.registerAsync([
      {
        name: MICROSERVICE_NAME,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory(configService: ConfigService) {
          return configService.getRabbitmqClientConfig();
        },
      },
    ]),
    TypeOrmModule.forFeature([Asset, CosBucket, Feed]),
    CacheModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.getRedisConfig(),
    }),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.getElasticsearchConfig(),
    }),
    OauthApplicationModule,
    ConfigModule,
  ],
  providers: [
    CoreService,
    CacheService,
    SearchService,
    OauthApplicationConfigProvider,
    JwtConfigProvider,
  ],
  exports: [
    CoreService,
    CacheService,
    SearchService,
    OauthApplicationConfigProvider,
    JwtConfigProvider,
  ],
})
export class CoreModule {}
