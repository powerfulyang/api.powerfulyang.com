import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreateOauthApplicationDto } from '@/oauth-application/dto/create-oauth-application.dto';
import { OauthApplication } from '@/oauth-application/entities/oauth-application.entity';
import type { SupportOauthApplication } from '@/oauth-application/entities/support-oauth.application';

@Injectable()
export class OauthApplicationService {
  constructor(
    @InjectRepository(OauthApplication) private readonly appDao: Repository<OauthApplication>,
  ) {}

  getApplicationByPlatformName(platformName: SupportOauthApplication) {
    return this.appDao.findOneOrFail({
      select: ['clientId', 'clientSecret', 'callbackUrl', 'id'],
      where: { platformName },
    });
  }

  createNewOauthApplication(oauthApplication: CreateOauthApplicationDto) {
    return this.appDao.insert(oauthApplication);
  }

  deleteOauthApplication(platformName: OauthApplication['platformName']) {
    return this.appDao.delete({ platformName });
  }
}
