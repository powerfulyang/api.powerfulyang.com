import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Profile } from 'passport-github';
import { Strategy } from 'passport-github';
import { OAUTH_APPLICATION_STRATEGY_CONFIG_TYPE } from '@/common/authorization/strategy.module';
import { LoggerService } from '@/common/logger/logger.service';
import { Default_Auth_Success_Target_Url } from '@/constants/constants';
import { OAUTH_APPLICATION_STRATEGY_CONFIG } from '@/constants/PROVIDER_TOKEN';

import { SupportOauthApplication } from '@/oauth-application/entities/support-oauth.application';
import { ProxyFetchService } from '@/libs/proxy-fetch';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, SupportOauthApplication.github) {
  constructor(
    private readonly proxyFetchService: ProxyFetchService,
    private readonly logger: LoggerService,
    @Inject(OAUTH_APPLICATION_STRATEGY_CONFIG)
    readonly config: OAUTH_APPLICATION_STRATEGY_CONFIG_TYPE,
  ) {
    super({
      clientID: config.github.clientId,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callbackUrl,
      scope: ['user:email'],
    });
    this.logger.setContext(GithubStrategy.name);
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

  validate(_: string, __: string, profile: Profile) {
    this.logger.info(`displayName->${profile.displayName}, openid->${profile.id}`);
    return profile;
  }
}
