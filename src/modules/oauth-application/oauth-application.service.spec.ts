import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { OauthApplicationService } from './oauth-application.service';
import { OauthApplicationModule } from '@/modules/oauth-application/oauth-application.module';

describe('OauthApplicationService', () => {
  let service: OauthApplicationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OauthApplicationModule],
    }).compile();

    service = module.get<OauthApplicationService>(OauthApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
