import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OauthApplication, OauthOpenid } from '@/modules/oauth-openid/entities/oauth-openid.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OauthOpenidService {
  constructor(
    @InjectRepository(OauthOpenid) private readonly oauthOpenidDao: Repository<OauthOpenid>,
  ) {}

  findOne(openid: string, application: OauthApplication) {
    return this.oauthOpenidDao.findOne({
      relations: ['user'],
      where: {
        openid,
        application,
      },
    });
  }
}
