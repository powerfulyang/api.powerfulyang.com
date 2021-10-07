import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import type { Profile } from 'passport-google-oauth20';
import { Strategy } from 'passport-google-oauth20';
import { ProxyFetchService } from 'api/proxy-fetch';
import { AppLogger } from '@/common/logger/app.logger';
import { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';
import { OAUTH_APPLICATION_STRATEGY_CONFIG_TYPE } from '@/common/authorization/strategy.module';
import { OAUTH_APPLICATION_STRATEGY_CONFIG } from '@/constants/PROVIDER_TOKEN';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, SupportOauthApplication.google) {
  constructor(
    private readonly proxyFetchService: ProxyFetchService,
    private readonly logger: AppLogger,
    @Inject(OAUTH_APPLICATION_STRATEGY_CONFIG)
    readonly config: OAUTH_APPLICATION_STRATEGY_CONFIG_TYPE,
  ) {
    super({
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackUrl,
      scope: ['email', 'profile'],
    });
    this._oauth2.setAgent(this.proxyFetchService.getAgent());
    this.logger.setContext(GoogleStrategy.name);
  }

  async validate(_: any, __: any, profile: Profile) {
    this.logger.info(`displayName->${profile.displayName}, openid->${profile.id}`);
    return profile;
  }
}
