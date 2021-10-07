import { Module } from '@nestjs/common';
import { JwtStrategy } from '@/common/authorization/jwt.strategy';
import { GoogleStrategy } from '@/common/authorization/google.strategy';
import { UserModule } from '@/modules/user/user.module';
import type {
  OauthApplication,
  SupportOauthApplication,
} from '@/modules/oauth-application/entities/oauth-application.entity';

export declare type OAUTH_APPLICATION_STRATEGY_CONFIG_TYPE = {
  [key in SupportOauthApplication]: OauthApplication;
};

@Module({
  imports: [UserModule],
  providers: [JwtStrategy, GoogleStrategy],
})
export class StrategyModule {}
