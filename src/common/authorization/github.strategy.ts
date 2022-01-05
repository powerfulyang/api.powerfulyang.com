import { PassportStrategy } from '@nestjs/passport';
import type { Profile } from 'passport-github';
import { Strategy } from 'passport-github';
import { Inject, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import { ProxyFetchService } from 'api/proxy-fetch';
import { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';
import { AppLogger } from '@/common/logger/app.logger';
import { PRIMARY_ORIGIN } from '@/constants/constants';
import { OAUTH_APPLICATION_STRATEGY_CONFIG } from '@/constants/PROVIDER_TOKEN';
import { OAUTH_APPLICATION_STRATEGY_CONFIG_TYPE } from '@/common/authorization/strategy.module';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, SupportOauthApplication.github) {
  constructor(
    private readonly proxyFetchService: ProxyFetchService,
    private readonly logger: AppLogger,
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
    const agent = this.proxyFetchService.getAgent();
    if (agent) {
      this._oauth2.setAgent(agent);
    }
  }

  authenticate(req: Request<ParamsDictionary, any, any, { redirect?: string }>) {
    const { redirect = PRIMARY_ORIGIN } = req.query;
    super.authenticate(req, {
      state: Buffer.from(redirect).toString('base64'),
    });
  }

  validate(_: string, __: string, profile: Profile) {
    this.logger.info(`displayName->${profile.displayName}, openid->${profile.id}`);
    return profile;
  }
}
