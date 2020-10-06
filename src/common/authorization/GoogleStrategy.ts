import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ProxyFetchService } from 'api/proxy-fetch';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
    Strategy,
    'google',
) {
    private readonly logger = new Logger(GoogleStrategy.name);

    constructor(private proxyFetchService: ProxyFetchService) {
        super({
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
            scope: ['email', 'profile'],
            proxy: true,
        });
        this._oauth2.setAgent(this.proxyFetchService.agent);
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        this.logger.debug({ profile, accessToken, refreshToken });
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken,
        };
        done(undefined, user);
    }
}
