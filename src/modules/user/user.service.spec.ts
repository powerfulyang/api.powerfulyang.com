import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { AppModule } from '@/app.module';
import { RoleService } from '@/modules/user/role/role.service';

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
    const results = await service.updatePassword(1, 'password');
    expect(results).toHaveProperty('affected', 1);
  });

  it('cacheUsers', async function () {
    const result = await service.cacheUsers();
    expect(result).toBe('OK');
    const cachedUser = await service.getCachedUsers(1);
    expect(cachedUser).toHaveProperty('id', 1);
  });
});
