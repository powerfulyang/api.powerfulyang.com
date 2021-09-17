import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { AppModule } from '@/app.module';
import { Role } from '@/modules/user/entities/role.entity';
import { MenuService } from '@/modules/user/menu/menu.service';

describe('RoleService', () => {
  let service: RoleService;
  let menuService: MenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<RoleService>(RoleService);
    menuService = module.get<MenuService>(MenuService);
  });

  it('setRoleMenu', async () => {
    const menus = await menuService.menuDao.find();
    let role = await service.roleDao.findOne({ roleName: 'admin' });
    if (!role) {
      role = new Role();
      role.menus = menus;
      role.roleName = 'admin';
    }
    await service.setRoleMenu(role);
    expect(role).toBeDefined();
  });

  it('generate default role', async () => {
    const menus = await menuService.menuDao.find();
    const role = new Role();
    role.menus = menus;
    role.roleName = 'default';
    await service.setRoleMenu(role);
    expect(role).toBeDefined();
  });
});
