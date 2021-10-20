import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { AppModule } from '@/app.module';
import { User } from '@/modules/user/entities/user.entity';
import { getClassStaticProperties } from '@/utils/getClassStaticProperties';
import { getUserFamiliesMembers } from '@/utils/user.util';
import { SUCCESS } from '@/constants/constants';
import { AssetService } from '@/modules/asset/asset.service';

describe('UserService', () => {
  let service: UserService;
  let assetService: AssetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<UserService>(UserService);
    assetService = module.get<AssetService>(AssetService);
  });

  it(`get user's menus`, async function () {
    const menus = await service.getUserMenus(1);
    expect(menus).toBeDefined();
  });

  it('update password', async function () {
    const results = await service.updatePassword(1);
    expect(results).toHaveProperty('affected', 1);
  });

  it('cacheUsers', async function () {
    const result = await service.cacheUsers();
    expect(result).toBe(SUCCESS);
    const cachedUser = await service.getCachedUser(1);
    const users = getUserFamiliesMembers(cachedUser);
    expect(users).toBeDefined();
    expect(cachedUser).toHaveProperty('id', 1);
  });

  it('to set user family', async () => {
    const user = await service.getUserCascadeFamilyInfo(4);
    const family = await service.queryFamily(1);
    user.families = [family];
    const newUser = await service.updateUserAndCached(user);
    expect(newUser.families).toStrictEqual(user.families);
  });

  it('to add our two', async function () {
    const family = await service.queryFamily(1);
    const user1 = new User();
    user1.id = 1;
    const user2 = new User();
    user2.id = 4;
    family.members = [user1, user2];
    const newFamily = await service.saveFamily(family);
    expect(newFamily.members).toStrictEqual(family.members);
  });

  it('class User static property', () => {
    const staticProperties = getClassStaticProperties(User);
    expect(staticProperties).toBeDefined();
  });

  it('get cache and update cache will lost family data', async () => {
    const user = await service.getUserCascadeFamilyInfo(1);
    user.avatar = '1';
    await service.updateUserAndCached(user);
    const reloadCache = await service.getCachedUser(1);
    expect(reloadCache.families).toBeDefined();
  });

  it('set user random background', async () => {
    let user = await service.getCachedUser(1);
    user.timelineBackground = await assetService.randomAsset();
    user = await service.updateUserAndCached(user);
    expect(user).toBeDefined();
  });
});
