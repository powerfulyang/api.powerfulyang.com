import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OauthApplication, OauthOpenid } from '@/modules/oauth-openid/entities/oauth-openid.entity';

@Injectable()
export class OauthOpenidService {
  constructor(
    @InjectRepository(OauthOpenid) private readonly oauthOpenidDao: Repository<OauthOpenid>,
  ) {}

  findUserByGoogleOpenid(googleOpenid: string) {
    return this.findOne(googleOpenid, OauthApplication.google);
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
