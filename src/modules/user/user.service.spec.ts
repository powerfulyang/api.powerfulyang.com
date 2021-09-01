import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { AppModule } from '@/app.module';
import { RoleService } from '@/modules/user/role/role.service';
import { User } from '@/entity/user.entity';
import { Family } from '@/entity/family.entity';
import { PlainStaticProperties } from '@/utils/plain.static.properties';
import { getUserFamiliesMembers } from '@/utils/user.uti';

describe('UserService', () => {
  let service: UserService;
  let roleService: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<UserService>(UserService);
    roleService = module.get<RoleService>(RoleService);
  });

  it('setUserRole', async () => {
    const role = await roleService.roleDao.findOneOrFail();
    const user = await service.userDao.findOneOrFail();
    user.roles = [role];
    await service.setUserRole(user);
    expect(user).toBeDefined();
  });

  it(`get user's menus`, async function () {
    const menus = await service.getUserMenus(1);
    expect(menus).toBeDefined();
  });

  it('update password', async function () {
    const results = await service.updatePassword(4, 'yxw@zhj20210528');
    expect(results).toHaveProperty('affected', 1);
  });

  it('cacheUsers', async function () {
    const result = await service.cacheUsers();
    expect(result).toBe('OK');
    const cachedUser = await service.getCachedUsers(1);
    const users = getUserFamiliesMembers(cachedUser);
    expect(users).toBeDefined();
    expect(cachedUser).toHaveProperty('id', 1);
  });

  it('generate random password', () => {
    const user = new User();
    service.generateDefaultPassword(user);
    const { password, passwordSalt } = user;
    const bool = service.verifyPassword(passwordSalt, passwordSalt, password);
    expect(bool).toBeTruthy();
  });

  it('create a family', async () => {
    const family = new Family();
    family.name = 'Public Home';
    const created = await service.saveFamily(family);
    expect(created).toBeDefined();
  });

  it('to set user family', async () => {
    const user = await service.queryUser(4);
    const family = await service.queryFamily(1);
    user.families = [family];
    const newUser = await service.cascadeUpdateUser(user);
    expect(newUser.families).toStrictEqual(user.families);
  });

  it('to add our two', async function () {
    const family = await service.queryFamily(1);
    family.members = await service.userDao.findByIds([1, 4]);
    const newFamily = await service.saveFamily(family);
    expect(newFamily.members).toStrictEqual(family.members);
  });

  it(`get all users of user's all family`, async () => {
    const user = await service.relationQueryUserAllFamilyMembers(1);
    expect(user).toBeDefined();
  });

  it('class User static property', () => {
    const staticProperties = PlainStaticProperties(User);
    expect(staticProperties).toStrictEqual([
      User.RelationColumnFamilies,
      User.RelationColumnFamilyMembers,
    ]);
  });
});
