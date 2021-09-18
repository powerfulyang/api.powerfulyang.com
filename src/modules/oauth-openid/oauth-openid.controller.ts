import { Controller, Get } from '@nestjs/common';
import { OauthApplication } from '@/modules/oauth-openid/entities/oauth-openid.entity';
import { getEnumKeys } from '@/utils/getClassStaticProperties';

@Controller('oauth-openid')
export class OauthOpenidController {
  @Get()
  findAll() {
    return getEnumKeys(OauthApplication);
  }
}
