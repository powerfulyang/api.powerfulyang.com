import { OAUTH_APPLICATION_STRATEGY_CONFIG_TYPE } from '@/common/authorization/strategy.module';
import { LoggerService } from '@/common/logger/logger.service';
import { Default_Auth_Success_Target_Url } from '@/constants/constants';
import { OAUTH_APPLICATION_STRATEGY_CONFIG } from '@/constants/PROVIDER_TOKEN';
import { SupportOauthApplication } from '@/oauth-application/entities/oauth-application.entity';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ProxyFetchService } from 'api/proxy-fetch';
import type { Profile } from 'passport-google-oauth20';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, SupportOauthApplication.google) {
  constructor(
    private readonly proxyFetchService: ProxyFetchService,
    private readonly logger: LoggerService,
    @Inject(OAUTH_APPLICATION_STRATEGY_CONFIG)
    readonly config: OAUTH_APPLICATION_STRATEGY_CONFIG_TYPE,
  ) {
    super({
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackUrl,
      scope: ['email', 'profile'],
    });

    this.logger.setContext(GoogleStrategy.name);
    const { agent } = this.proxyFetchService;
    if (agent) {
      this._oauth2.setAgent(agent);
    }
  }

  authenticate(req: any) {
    const { redirect = Default_Auth_Success_Target_Url } = req.query;
    super.authenticate(req, {
      state: Buffer.from(redirect).toString('base64'),
    });
  }

  validate(_: any, __: any, profile: Profile) {
    this.logger.info(`displayName->${profile.displayName}, openid->${profile.id}`);
    return profile;
  }
}
