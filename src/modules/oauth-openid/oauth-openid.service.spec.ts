import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';
import { OauthOpenidModule } from '@/modules/oauth-openid/oauth-openid.module';
import { OauthOpenidService } from './oauth-openid.service';

describe('OauthOpenidService', () => {
  let service: OauthOpenidService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OauthOpenidModule],
    }).compile();

    service = module.get<OauthOpenidService>(OauthOpenidService);
  });

  it('unbind and bind', async () => {
    const unbindRes = service.unbindOpenid({ id: 1 }, 'test', SupportOauthApplication.test);
    expect(unbindRes).toBeDefined();
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
