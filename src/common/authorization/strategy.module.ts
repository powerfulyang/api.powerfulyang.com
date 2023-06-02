import { GithubStrategy } from '@/common/authorization/github.strategy';
import { GoogleStrategy } from '@/common/authorization/google.strategy';
import { JwtStrategy } from '@/common/authorization/jwt.strategy';
import { PublicStrategy } from '@/common/authorization/public.strategy';
import { ConfigModule } from '@/common/config/config.module';
import { ConfigService } from '@/common/config/config.service';
import { LoggerModule } from '@/common/logger/logger.module';
import { JWT_SECRET_CONFIG, OAUTH_APPLICATION_STRATEGY_CONFIG } from '@/constants/PROVIDER_TOKEN';
import type { OauthApplication } from '@/oauth-application/entities/oauth-application.entity';
import { SupportOauthApplication } from '@/oauth-application/entities/oauth-application.entity';
import { OauthApplicationModule } from '@/oauth-application/oauth-application.module';
import { OauthApplicationService } from '@/oauth-application/oauth-application.service';
import { UserModule } from '@/user/user.module';
import type { Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ProxyFetchModule } from 'api/proxy-fetch';

export declare type OAUTH_APPLICATION_STRATEGY_CONFIG_TYPE = {
  [key in SupportOauthApplication]: OauthApplication;
};

const JwtConfigProvider: Provider = {
  provide: JWT_SECRET_CONFIG,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => configService.getJwtConfig(),
};

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

@Module({
  imports: [
    UserModule,
    OauthApplicationModule,
    ConfigModule,
    LoggerModule,
    ProxyFetchModule.forRoot(),
  ],
  providers: [
    JwtStrategy,
    GoogleStrategy,
    PublicStrategy,
    GithubStrategy,
    JwtConfigProvider,
    OauthApplicationConfigProvider,
  ],
})
export class StrategyModule {}
