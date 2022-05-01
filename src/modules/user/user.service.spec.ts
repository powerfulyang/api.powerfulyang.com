import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { isNull } from '@powerfulyang/utils';
import { generateRandomString } from '@powerfulyang/node-utils';
import { User } from '@/modules/user/entities/user.entity';
import { SUCCESS } from '@/constants/constants';
import { UserModule } from '@/modules/user/user.module';
import { Family } from '@/modules/user/entities/family.entity';
import { getUserFamiliesMembers } from '@/common/decorator/user-from-auth.decorator';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('initIntendedUsers', async () => {
    const users = await service.initIntendedUsers();
    expect(users).toBeDefined();
  });

  it('cacheUsers', async () => {
    const result = await service.cacheUsers();
    expect(result).toBe(SUCCESS);
    const adminUser = await service.getUserByEmail(User.IntendedUsers.AdminUser);
    const cachedUser = await service.getCachedUser(adminUser.id);
    const users = getUserFamiliesMembers(cachedUser);
    expect(users).toBeDefined();
    expect(cachedUser).toHaveProperty('email', User.IntendedUsers.AdminUser);
  });

  it('sendDefaultPassword', async () => {
    const res = await service.sendDefaultPassword('i@Powerfulyang.com', generateRandomString());
    expect(res).toBe(SUCCESS);
  });

  it(`get user's menus`, async () => {
    const menus = await service.queryMenusByUserId(1);
    expect(menus).toBeDefined();
  });

  it(`generateAuthorization and verifyAuthorization`, async () => {
    const user = new User();
    user.id = 1;
    const authorization = await service.generateAuthorization(user);
    expect(authorization).toBeDefined();
    const verify = await service.verifyAuthorization(authorization);
    expect(verify).toHaveProperty('id', 1);
    expect(verify).toHaveProperty('exp', expect.any(Number));
  });

  it('update password & login & verifyAuthorization', async () => {
    const user = await service.getUserByEmail(User.IntendedUsers.AdminUser);
    const result = await service.updatePassword(user.id);
    const token = await service.login({
      email: User.IntendedUsers.AdminUser,
      password: result.salt,
    });
    const verify = await service.verifyAuthorization(token);
    expect(verify).toHaveProperty('id', result.id);
  });

  it('getUserCascadeFamilyInfo', async () => {
    const user = await service.getUserByEmail(User.IntendedUsers.AdminUser);
    const result = await service.queryUserCascadeFamilyInfo(user.id);
    const result2 = await service.queryUserCascadeFamilyInfo([user.id]);
    const result3 = await service.queryUserCascadeFamilyInfo();

    expect(result).toBeDefined();
    expect(result2).toBeDefined();
    expect(result3).toBeDefined();
  });

  it('family test', async () => {
    let family = new Family('test family');
    const result = await service.getFamilyByName(family.name);
    if (isNull(result)) {
      family = await service.crateNewFamily(family);
    } else {
      family = result;
    }
    family = await service.getFamilyById(family.id);
    expect(family).toHaveProperty('name', 'test family');
    const adminUserSimple = await service.getUserByEmail(User.IntendedUsers.AdminUser);
    const res = await service.setUserFamily(adminUserSimple.id, family.id, 'add');
    expect(res.families).toContainEqual(family);
    // remove adminUser test family
    const res2 = await service.setUserFamily(adminUserSimple.id, family.id, 'remove');
    expect(res2.families).not.toContainEqual(family);
  });
});
