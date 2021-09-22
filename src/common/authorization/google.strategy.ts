import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import type { Profile} from 'passport-google-oauth20';
import { Strategy } from 'passport-google-oauth20';
import { ProxyFetchService } from 'api/proxy-fetch';
import { AppLogger } from '@/common/logger/app.logger';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private proxyFetchService: ProxyFetchService, private logger: AppLogger) {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
    this._oauth2.setAgent(this.proxyFetchService.agent);
    this.logger.setContext(GoogleStrategy.name);
  }

  async validate(_: any, __: any, profile: Profile) {
    this.logger.info(`displayName->${profile.displayName}, openid->${profile.id}`);
    return profile;
  }
}
