import { LoggerService } from '@/common/logger/logger.service';
import { BaseService } from '@/common/service/base/BaseService';
import type { QueryMenusDto } from '@/modules/user/dto/query-menus.dto';
import { Menu } from '@/modules/user/entities/menu.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { pick } from 'lodash';
import type { TreeRepository } from 'typeorm';
import { DataSource } from 'typeorm';

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
      relations: ['parent'],
      loadEagerRelations: false,
      where: {
        id: this.ignoreFalsyValue(pagination.id),
        name: this.iLike(pagination.name),
        path: this.iLike(pagination.path),
        createdAt: this.convertDateRangeToBetween(pagination.createdAt),
        updatedAt: this.convertDateRangeToBetween(pagination.updatedAt),
      },
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

  async createOrEditMenu(menu: Menu) {
    const _m = pick(menu, ['id', 'name', 'path', 'parent']);
    return this.menuDao.save(_m);
  }

  async deleteMenuById(id: string) {
    const res = await this.menuDao.delete(id);
    if (res.affected === 0) {
      throw new Error('Delete menu failed');
    }
  }

  queryAllMenus() {
    return this.menuDao.findTrees();
  }
}
