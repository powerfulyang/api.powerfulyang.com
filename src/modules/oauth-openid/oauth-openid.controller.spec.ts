import { Test, TestingModule } from '@nestjs/testing';
import { OauthOpenidController } from './oauth-openid.controller';
import { OauthOpenidService } from './oauth-openid.service';

describe('OauthOpenidController', () => {
  let controller: OauthOpenidController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OauthOpenidController],
      providers: [OauthOpenidService],
    }).compile();

    controller = module.get<OauthOpenidController>(OauthOpenidController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
