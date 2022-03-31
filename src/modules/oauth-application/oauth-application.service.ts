import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';
import { OauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';
import type { CreateOauthApplicationDto } from '@/modules/oauth-application/dto/create-oauth-application.dto';

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
