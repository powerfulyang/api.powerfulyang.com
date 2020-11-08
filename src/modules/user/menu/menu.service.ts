import { Injectable } from '@nestjs/common';
import { TreeRepository } from 'typeorm';
import { Menu } from '@/entity/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu)
        readonly menuDao: TreeRepository<Menu>,
    ) {}

    menus() {
        return this.menuDao.findTrees();
    }
}
