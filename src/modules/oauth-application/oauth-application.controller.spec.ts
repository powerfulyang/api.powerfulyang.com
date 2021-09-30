import { Test, TestingModule } from '@nestjs/testing';
import { OauthApplicationController } from './oauth-application.controller';
import { OauthApplicationService } from './oauth-application.service';

describe('OauthApplicationController', () => {
  let controller: OauthApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OauthApplicationController],
      providers: [OauthApplicationService],
    }).compile();

    controller = module.get<OauthApplicationController>(OauthApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
