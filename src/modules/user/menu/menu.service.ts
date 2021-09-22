import { Injectable } from '@nestjs/common';
import { TreeRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Memoize } from '@powerfulyang/utils';
import { Menu } from '@/modules/user/entities/menu.entity';

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
