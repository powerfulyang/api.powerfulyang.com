import { PartialType } from '@nestjs/mapped-types';
import { CreateOauthOpenidDto } from './create-oauth-openid.dto.mjs';

export class UpdateOauthOpenidDto extends PartialType(CreateOauthOpenidDto) {}
