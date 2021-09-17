import { Injectable } from '@nestjs/common';
import { TreeRepository } from 'typeorm';
import { Menu } from '@/modules/user/entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Memoize } from '@powerfulyang/utils';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    readonly menuDao: TreeRepository<Menu>,
  ) {}

  @Memoize()
  menus() {
    return this.menuDao.findTrees();
  }
}
