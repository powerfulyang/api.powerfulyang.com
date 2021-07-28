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

  it('post a new story', async () => {
    const user = await userService.queryUserInfo(1);
    const res = await service.create({
      createBy: user,
      content: '我的第一条说说! #第一条说说',
    });
    expect(res).toBeDefined();
  });

  it('post a story with assets', async () => {
    const user = await userService.queryUserInfo(1);
    const asset = await assetService.randomAsset();
    const res = await service.create({
      createBy: user,
      content: '我的第二条说说! #带图的',
      assets: [asset],
    });
    expect(res).toBeDefined();
  });

  it('relation query', async () => {
    const res = await service.relationQuery();
    expect(res).toBeDefined();
  });
});
