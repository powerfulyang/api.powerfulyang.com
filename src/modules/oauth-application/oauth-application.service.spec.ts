import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { OauthApplicationService } from './oauth-application.service';
import { OauthApplicationModule } from '@/modules/oauth-application/oauth-application.module';
import { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';

describe('OauthApplicationService', () => {
  let service: OauthApplicationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OauthApplicationModule],
    }).compile();

    service = module.get<OauthApplicationService>(OauthApplicationService);
  });

  it('test', async () => {
    const result = await service.createNewOauthApplication({
      platformName: SupportOauthApplication.test,
      clientId: 'test',
      clientSecret: 'test',
      callbackUrl: 'test',
    });
    expect(result).toBeDefined();
    const result2 = await service.getApplicationByPlatformName(SupportOauthApplication.test);
    expect(result2).toBeDefined();
    const result3 = await service.deleteOauthApplication(SupportOauthApplication.test);
    expect(result3).toBeDefined();
    const result4 = await service.createNewOauthApplication({
      platformName: SupportOauthApplication.test,
      clientId: 'test',
      clientSecret: 'test',
      callbackUrl: 'test',
    });
    expect(result4).toBeDefined();
  });
});
