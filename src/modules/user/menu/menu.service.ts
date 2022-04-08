import { Injectable } from '@nestjs/common';
import type { TreeRepository } from 'typeorm';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Menu } from '@/modules/user/entities/menu.entity';

@Injectable()
export class MenuService {
  private readonly menuDao: TreeRepository<Menu>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.menuDao = this.dataSource.getTreeRepository(Menu);
  }

  menus() {
    return this.menuDao.findTrees();
  }
}
