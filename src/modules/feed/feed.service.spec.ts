import { Test, TestingModule } from '@nestjs/testing';
import { FeedService } from './feed.service';
import { AppModule } from '@/app.module';
import { UserService } from '@/modules/user/user.service';
import { AssetService } from '@/modules/asset/asset.service';

describe('FeedService', () => {
  let service: FeedService;
  let userService: UserService;
  let assetService: AssetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<FeedService>(FeedService);
    userService = module.get<UserService>(UserService);
    assetService = module.get<AssetService>(AssetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(assetService).toBeDefined();
  });
});
