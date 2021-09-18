import { Test, TestingModule } from '@nestjs/testing';
import { OauthOpenidService } from './oauth-openid.service';

describe('OauthOpenidService', () => {
  let service: OauthOpenidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OauthOpenidService],
    }).compile();

    service = module.get<OauthOpenidService>(OauthOpenidService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
