import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from './menu.service';
import { UserModule } from '../user.module';

describe('MenuService', () => {
  let service: MenuService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    service = module.get<MenuService>(MenuService);
  });

  it('menus', async () => {
    const res = await service.menus();
    expect(res).toBeDefined();
  });
});
