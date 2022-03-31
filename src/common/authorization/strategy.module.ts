import type { Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { JwtStrategy } from '@/common/authorization/jwt.strategy';
import { GoogleStrategy } from '@/common/authorization/google.strategy';
import { UserModule } from '@/modules/user/user.module';
import { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';
import type { OauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';
import { PublicAuthStrategy } from '@/common/authorization/public.auth.strategy';
import { GithubStrategy } from '@/common/authorization/github.strategy';
import { JWT_SECRET_CONFIG, OAUTH_APPLICATION_STRATEGY_CONFIG } from '@/constants/PROVIDER_TOKEN';
import { ConfigService } from '@/common/config/config.service';
import { OauthApplicationService } from '@/modules/oauth-application/oauth-application.service';
import { OauthApplicationModule } from '@/modules/oauth-application/oauth-application.module';
import { ConfigModule } from '@/common/config/config.module';

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
  imports: [UserModule, OauthApplicationModule, ConfigModule],
  providers: [
    JwtStrategy,
    GoogleStrategy,
    PublicAuthStrategy,
    GithubStrategy,
    JwtConfigProvider,
    OauthApplicationConfigProvider,
  ],
})
export class StrategyModule {}
