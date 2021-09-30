import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OauthOpenid } from '@/modules/oauth-openid/entities/oauth-openid.entity';
import type { OauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';
import { OauthApplicationService } from '@/modules/oauth-application/oauth-application.service';

@Injectable()
export class OauthOpenidService {
  constructor(
    @InjectRepository(OauthOpenid) private readonly oauthOpenidDao: Repository<OauthOpenid>,
    private readonly oauthApplicationService: OauthApplicationService,
  ) {}

  async findUserByGoogleOpenid(googleOpenid: string) {
    const application = await this.oauthApplicationService.getGoogle();
    return this.findOne(googleOpenid, application);
  }

  private findOne(openid: string, application: OauthApplication) {
    return this.oauthOpenidDao.findOne({
      where: {
        openid,
        application,
      },
    });
  }
}
