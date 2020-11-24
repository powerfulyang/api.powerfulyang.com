import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from './menu.service';
import { AppModule } from '@/app.module';
import { Menu } from '@/entity/menu.entity';

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<MenuService>(MenuService);
  });

  it('init menus', async () => {
    const cosMenu = new Menu('cos bucket list', '/bucket');
    const galleryMenu = new Menu('gallery', '/gallery');
    await service.menuDao.save([cosMenu, galleryMenu]);
    const galleryListMenu = new Menu('gallery list', '/gallery/list');
    galleryListMenu.parent = galleryMenu;
    const pHashMenu = new Menu('gallery pHash list', '/gallery/pHash');
    pHashMenu.parent = galleryMenu;
    const menus = await service.menuDao.save([galleryListMenu, pHashMenu]);
    expect(menus).toBeDefined();
  });

  it('patch menus 2020-11-24 16:29', async function () {
    const postMenu = new Menu('post', '/post');
    await service.menuDao.save(postMenu);
    const postsMenu = new Menu('posts', '/post/list');
    postsMenu.parent = postMenu;
    const postCreateMenu = new Menu('post-create', '/post/create');
    postCreateMenu.parent = postMenu;
    const menus = await service.menuDao.save([postsMenu, postCreateMenu]);
    expect(menus).toBeDefined();
  });
});
