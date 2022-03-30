import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { OauthApplicationModule } from '@/modules/oauth-application/oauth-application.module';
import { OauthApplicationService } from '@/modules/oauth-application/oauth-application.service';
import { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';
import { JWT_SECRET_CONFIG, OAUTH_APPLICATION_STRATEGY_CONFIG } from '@/constants/PROVIDER_TOKEN';
import { ConfigService } from '@/common/config/config.service';
import { CacheModule } from '@/common/cache/cache.module';

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
  provide: JWT_SECRET_CONFIG,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => configService.getJwtConfig(),
};

@Global()
@Module({
  imports: [OauthApplicationModule, CacheModule],
  providers: [CoreService, OauthApplicationConfigProvider, JwtConfigProvider],
  exports: [CoreService, OauthApplicationConfigProvider, JwtConfigProvider],
})
export class CoreModule {}
