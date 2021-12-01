import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import type { Profile } from 'passport-google-oauth20';
import { Strategy } from 'passport-google-oauth20';
import { ProxyFetchService } from 'api/proxy-fetch/index.mjs';
import type { Request } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import { AppLogger } from '@/common/logger/app.logger.mjs';
import { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity.mjs';
import { OAUTH_APPLICATION_STRATEGY_CONFIG_TYPE } from '@/common/authorization/strategy.module.mjs';
import { OAUTH_APPLICATION_STRATEGY_CONFIG } from '@/constants/PROVIDER_TOKEN.mjs';
import { PRIMARY_ORIGIN } from '@/constants/constants.mjs';

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

  authenticate(req: Request<ParamsDictionary, any, any, { redirect?: string }>) {
    const { redirect = PRIMARY_ORIGIN } = req.query;
    super.authenticate(req, {
      state: Buffer.from(redirect).toString('base64'),
    });
  }

  async validate(_: any, __: any, profile: Profile) {
    this.logger.info(`displayName->${profile.displayName}, openid->${profile.id}`);
    return profile;
  }
}
