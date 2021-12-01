import { Test, TestingModule } from '@nestjs/testing';
import { OauthApplicationService } from './oauth-application.service.mjs';

describe('OauthApplicationService', () => {
  let service: OauthApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OauthApplicationService],
    }).compile();

    service = module.get<OauthApplicationService>(OauthApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
