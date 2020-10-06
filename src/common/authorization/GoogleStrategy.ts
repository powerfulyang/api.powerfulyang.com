import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {
    Profile,
    Strategy,
    VerifyCallback,
} from 'passport-google-oauth20';
import { ProxyFetchService } from 'api/proxy-fetch';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
    Strategy,
    'google',
) {
    constructor(private proxyFetchService: ProxyFetchService) {
        super({
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
            scope: ['email', 'profile'],
        });
        this._oauth2.setAgent(this.proxyFetchService.agent);
    }

    validate(
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ) {
        done(undefined, profile);
    }
}
