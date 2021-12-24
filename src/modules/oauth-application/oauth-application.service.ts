import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';
import { OauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';

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
}
