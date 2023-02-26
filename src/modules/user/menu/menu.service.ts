import { Injectable } from '@nestjs/common';
import type { TreeRepository } from 'typeorm';
import { DataSource, IsNull } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Menu } from '@/modules/user/entities/menu.entity';
import { LoggerService } from '@/common/logger/logger.service';
import { BaseService } from '@/common/service/base/BaseService';
import type { QueryMenusDto } from '@/modules/user/dto/query-menus.dto';

@Injectable()
export class MenuService extends BaseService {
  private readonly menuDao: TreeRepository<Menu>;

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private logger: LoggerService,
  ) {
    super();
    this.logger.setContext(MenuService.name);
    this.menuDao = this.dataSource.getTreeRepository(Menu);
  }

  queryMenus(pagination: QueryMenusDto) {
    return this.menuDao.findAndCount({
      skip: pagination.skip,
      take: pagination.take,
      order: {
        id: 'DESC',
      },
      relations: ['children'],
      where: [
        {
          parentId: IsNull(),
          id: this.ignoreFalsyValue(pagination.id),
          name: this.iLike(pagination.name),
          path: this.iLike(pagination.path),
          createAt: this.convertDateRangeToBetween(pagination.createAt),
          updateAt: this.convertDateRangeToBetween(pagination.updateAt),
        },
        {
          children: {
            id: this.ignoreFalsyValue(pagination.id),
            name: this.iLike(pagination.name),
            path: this.iLike(pagination.path),
            createAt: this.convertDateRangeToBetween(pagination.createAt),
            updateAt: this.convertDateRangeToBetween(pagination.updateAt),
          },
        },
      ],
    });
  }

  async initBuiltinMenus() {
    const menu = await this.menuDao.findOneBy({
      name: 'User Manage',
    });
    if (!menu) {
      const UserManage = {
        name: 'User Manage',
        path: '/user',
      };
      await this.menuDao.save(UserManage);
      const UserList = {
        name: 'User List',
        path: '/user/list',
        parent: UserManage,
      };
      await this.menuDao.save(UserList);
    }
    // System Manage
    const systemManage = await this.menuDao.findOneBy({
      name: 'System Manage',
    });
    if (!systemManage) {
      const SystemManage = {
        name: 'System Manage',
        path: '/system',
      };
      await this.menuDao.save(SystemManage);
      const RoleManage = {
        name: 'Role Manage',
        path: '/system/role',
        parent: SystemManage,
      };
      await this.menuDao.save(RoleManage);
      const MenuManage = {
        name: 'Menu Manage',
        path: '/system/menu',
        parent: SystemManage,
      };
      await this.menuDao.save(MenuManage);
    }
  }

  queryMenuById(id: string) {
    return this.menuDao.findOne({
      where: {
        id: Number(id),
      },
      relations: ['parent'],
    });
  }

  editMenuById(id: string, menu: Menu) {
    return this.menuDao.update(id, menu);
  }
}
