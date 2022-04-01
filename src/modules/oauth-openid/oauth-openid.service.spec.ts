import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { OauthOpenidService } from './oauth-openid.service';
import { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';
import { OauthOpenidModule } from '@/modules/oauth-openid/oauth-openid.module';

describe('OauthOpenidService', () => {
  let service: OauthOpenidService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OauthOpenidModule],
    }).compile();

    service = module.get<OauthOpenidService>(OauthOpenidService);
  });

  it('test', async () => {
    const result = await service.associateOpenid(
      {
        id: 1,
      },
      'test',
      SupportOauthApplication.test,
    );
    expect(result).toBeDefined();
    const res = await service.findUserByOpenid('test', SupportOauthApplication.test);
    expect(res?.user).toBeDefined();
  });
});
