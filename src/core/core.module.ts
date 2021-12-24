import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { Asset } from '@/modules/asset/entities/asset.entity';
import { CosBucket } from '@/modules/bucket/entities/bucket.entity';
import { SearchService } from '@/core/search/search.service';
import { MICROSERVICE_NAME } from '@/constants/constants';
import { Feed } from '@/modules/feed/entities/feed.entity';
import { CoreService } from './core.service';
import { CacheService } from './cache/cache.service';
import { OauthApplicationModule } from '@/modules/oauth-application/oauth-application.module';
import { OauthApplicationService } from '@/modules/oauth-application/oauth-application.service';
import { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';
import { JWT_SECRET, OAUTH_APPLICATION_STRATEGY_CONFIG } from '@/constants/PROVIDER_TOKEN';
import { ConfigModule } from './config/config.module';
import { ConfigService } from '@/core/config/config.service';
import { CacheModule } from '@/core/cache/cache.module';
import { MailModule } from '@/core/mail/mail.module';
import { MailService } from '@/core/mail/mail.service';

const OauthApplicationConfigProvider: Provider = {
  provide: OAUTH_APPLICATION_STRATEGY_CONFIG,
  inject: [OauthApplicationService],
  useFactory: async (oauthApplicationService: OauthApplicationService) => {
    const googleConfig = await oauthApplicationService.getApplicationByPlatformName(
      SupportOauthApplication.google,
    );
    const githubConfig = await oauthApplicationService.getApplicationByPlatformName(
      SupportOauthApplication.github,
    );
    return {
      [SupportOauthApplication.google]: googleConfig,
      [SupportOauthApplication.github]: githubConfig,
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
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.getElasticsearchConfig(),
    }),
    OauthApplicationModule,
    ConfigModule,
    CacheModule,
    MailModule,
  ],
  providers: [
    CoreService,
    CacheService,
    SearchService,
    OauthApplicationConfigProvider,
    JwtConfigProvider,
    MailService,
  ],
  exports: [
    CoreService,
    CacheService,
    SearchService,
    OauthApplicationConfigProvider,
    JwtConfigProvider,
    MailService,
  ],
})
export class CoreModule {}
