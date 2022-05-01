import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import type { Profile } from 'passport-google-oauth20';
import { Strategy } from 'passport-google-oauth20';
import { ProxyFetchService } from 'api/proxy-fetch';
import type { Request } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import { LoggerService } from '@/common/logger/logger.service';
import { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';
import { OAUTH_APPLICATION_STRATEGY_CONFIG_TYPE } from '@/common/authorization/strategy.module';
import { OAUTH_APPLICATION_STRATEGY_CONFIG } from '@/constants/PROVIDER_TOKEN';
import { SERVER_ORIGIN } from '@/constants/constants';

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
    const agent = this.proxyFetchService.getAgent();
    if (agent) {
      this._oauth2.setAgent(agent);
    }
  }

  authenticate(req: Request<ParamsDictionary, any, any, { redirect?: string }>) {
    const { redirect = SERVER_ORIGIN } = req.query;
    super.authenticate(req, {
      state: Buffer.from(redirect).toString('base64'),
    });
  }

  validate(_: any, __: any, profile: Profile) {
    this.logger.info(`displayName->${profile.displayName}, openid->${profile.id}`);
    return profile;
  }
}
