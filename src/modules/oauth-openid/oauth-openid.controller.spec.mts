import { Test, TestingModule } from '@nestjs/testing';
import { OauthOpenidController } from './oauth-openid.controller.mjs';
import { OauthOpenidService } from './oauth-openid.service.mjs';

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
