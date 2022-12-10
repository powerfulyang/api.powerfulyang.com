import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import {
  OauthApplication,
  SupportOauthApplication,
} from '@/modules/oauth-application/entities/oauth-application.entity';

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
