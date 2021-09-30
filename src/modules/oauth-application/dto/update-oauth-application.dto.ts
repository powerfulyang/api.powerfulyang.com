import { PartialType } from '@nestjs/mapped-types';
import { CreateOauthApplicationDto } from './create-oauth-application.dto';

export class UpdateOauthApplicationDto extends PartialType(CreateOauthApplicationDto) {}
