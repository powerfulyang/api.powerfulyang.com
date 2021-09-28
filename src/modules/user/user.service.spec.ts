import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { AppModule } from '@/app.module';
import { User } from '@/modules/user/entities/user.entity';
import { Family } from '@/modules/user/entities/family.entity';
import { getClassStaticProperties } from '@/utils/getClassStaticProperties';
import { getUserFamiliesMembers } from '@/utils/user.util';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<UserService>(UserService);
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
    expect(result).toBe('OK');
    const cachedUser = await service.getCachedUser(1);
    const users = getUserFamiliesMembers(cachedUser);
    expect(users).toBeDefined();
    expect(cachedUser).toHaveProperty('id', 1);
  });

  it('create a family', async () => {
    const family = new Family();
    family.name = 'Public Home';
    const created = await service.saveFamily(family);
    expect(created).toBeDefined();
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
});
