import { PartialType } from '@nestjs/swagger';
import { CreateOauthOpenidDto } from './create-oauth-openid.dto';

export class UpdateOauthOpenidDto extends PartialType(CreateOauthOpenidDto) {}
