import { LoggerService } from '@/common/logger/logger.service';
import type { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';
import { OauthApplicationService } from '@/modules/oauth-application/oauth-application.service';
import { OauthOpenid } from '@/modules/oauth-openid/entities/oauth-openid.entity';
import type { User } from '@/modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';

@Injectable()
export class OauthOpenidService {
  constructor(
    @InjectRepository(OauthOpenid) private readonly oauthOpenidDao: Repository<OauthOpenid>,
    private readonly oauthApplicationService: OauthApplicationService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(OauthOpenidService.name);
  }

  async findUserByOpenid(openid: string, platform: SupportOauthApplication) {
    const application = await this.oauthApplicationService.getApplicationByPlatformName(platform);
    return this.oauthOpenidDao.findOne({
      where: {
        openid,
        application,
      },
      relations: ['user'],
    });
  }

  /**
   * 关联新的 openid 到用户
   */
  async associateOpenid(
    userId: User['id'],
    openid: string,
    platform: SupportOauthApplication,
  ): Promise<OauthOpenid> {
    const application = await this.oauthApplicationService.getApplicationByPlatformName(platform);
    const oauthOpenid = new OauthOpenid();
    oauthOpenid.openid = openid;
    oauthOpenid.application = application;
    oauthOpenid.user = { id: userId } as User;
    return this.oauthOpenidDao.save(oauthOpenid);
  }

  /**
   * 解绑 openid
   */
  async unbindOpenid(userId: User['id'], openid: string, platform: SupportOauthApplication) {
    const application = await this.oauthApplicationService.getApplicationByPlatformName(platform);
    return this.oauthOpenidDao.delete({
      user: Equal(userId),
      openid,
      application,
    });
  }
}
