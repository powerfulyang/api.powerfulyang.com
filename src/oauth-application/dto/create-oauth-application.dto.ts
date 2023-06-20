import { OauthApplication } from '@/oauth-application/entities/oauth-application.entity';
import { SupportOauthApplication } from '@/oauth-application/entities/support-oauth.application';
import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateOauthApplicationDto extends PartialType(OauthApplication) {
  @IsNotEmpty()
  declare readonly platformName: SupportOauthApplication;

  @IsNotEmpty()
  declare readonly clientId: string;

  @IsNotEmpty()
  declare readonly clientSecret: string;

  @IsNotEmpty()
  declare readonly callbackUrl: string;
}
