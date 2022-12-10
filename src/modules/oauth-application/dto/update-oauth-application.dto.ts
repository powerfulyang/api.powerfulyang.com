import { PartialType } from '@nestjs/swagger';
import { CreateOauthApplicationDto } from './create-oauth-application.dto';

export class UpdateOauthApplicationDto extends PartialType(CreateOauthApplicationDto) {}
