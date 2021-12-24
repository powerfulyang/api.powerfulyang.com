import { Test, TestingModule } from '@nestjs/testing';
import { OauthOpenidService } from './oauth-openid.service';
import { AppModule } from '@/app.module';
import { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';

describe('OauthOpenidService', () => {
  let service: OauthOpenidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<OauthOpenidService>(OauthOpenidService);
  });

  it('get user info by google openid', async () => {
    const res = await service.findUserByOpenid(
      '115587634739937046451',
      SupportOauthApplication.google,
    );
    expect(res?.user).toBeDefined();
  });
});
