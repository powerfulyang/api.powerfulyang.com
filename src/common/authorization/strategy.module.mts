import { Module } from '@nestjs/common';
import { JwtStrategy } from '@/common/authorization/jwt.strategy.mjs';
import { GoogleStrategy } from '@/common/authorization/google.strategy.mjs';
import { UserModule } from '@/modules/user/user.module.mjs';
import type {
  OauthApplication,
  SupportOauthApplication,
} from '@/modules/oauth-application/entities/oauth-application.entity.mjs';
import { PublicAuthStrategy } from '@/common/authorization/public.auth.strategy.mjs';

export declare type OAUTH_APPLICATION_STRATEGY_CONFIG_TYPE = {
  [key in SupportOauthApplication]: OauthApplication;
};

@Module({
  imports: [UserModule],
  providers: [JwtStrategy, GoogleStrategy, PublicAuthStrategy],
})
export class StrategyModule {}
