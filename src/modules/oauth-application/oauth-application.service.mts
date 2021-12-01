import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  OauthApplication,
  SupportOauthApplication,
} from '@/modules/oauth-application/entities/oauth-application.entity.mjs';

@Injectable()
export class OauthApplicationService {
  constructor(
    @InjectRepository(OauthApplication) private readonly appDao: Repository<OauthApplication>,
  ) {}

  getGoogle() {
    return this.appDao.findOneOrFail({
      select: ['clientId', 'clientSecret', 'callbackUrl', 'id'],
      where: { platformName: SupportOauthApplication.google },
    });
  }
}
