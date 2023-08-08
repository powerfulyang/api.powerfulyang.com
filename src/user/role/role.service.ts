import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '@/common/logger/logger.service';
import { BaseService } from '@/service/base/BaseService';
import type { CreateRoleDto } from '@/user/dto/create-role.dto';
import type { QueryRolesDto } from '@/user/dto/query-roles.dto';
import { Menu } from '@/user/entities/menu.entity';
import { Role } from '@/user/entities/role.entity';

@Injectable()
export class RoleService extends BaseService {
  constructor(
    @InjectRepository(Role)
    private readonly roleDao: Repository<Role>,
    @InjectRepository(Menu)
    private readonly menuDao: Repository<Menu>,
    private readonly logger: LoggerService,
  ) {
    super();
    this.logger.setContext(RoleService.name);
  }

  getDefaultRole() {
    return this.roleDao.findOneByOrFail({ name: Role.IntendedRoles.default });
  }

  async initIntendedRoles() {
    const roleNames = Object.values(Role.IntendedRoles);
    for (const roleName of roleNames) {
      let role = await this.roleDao.findOneBy({
        name: roleName,
      });
      if (!role) {
        role = await this.roleDao.save({
          name: roleName,
        });
      }
      if (roleName === Role.IntendedRoles.admin) {
        // 为 admin role 添加所有的菜单
        role.menus = await this.menuDao.find();
        await this.roleDao.save(role);
      }
    }
  }

  queryRoles(pagination: QueryRolesDto) {
    return this.roleDao.findAndCount({
      skip: pagination.skip,
      take: pagination.take,
      order: {
        id: 'DESC',
      },
      where: {
        name: this.iLike(pagination.name),
        id: this.ignoreFalsyValue(pagination.id),
        createdAt: this.convertDateRangeToBetween(pagination.createdAt),
        updatedAt: this.convertDateRangeToBetween(pagination.updatedAt),
      },
    });
  }

  queryRoleById(id: number) {
    return this.roleDao.findOneOrFail({
      where: {
        id,
      },
      loadRelationIds: true,
    });
  }

  async deleteRoleById(id: number) {
    const res = await this.roleDao.delete(id);
    if (res.affected === 0) {
      throw new Error('Delete role failed');
    }
  }

  createOrUpdateRole(role: CreateRoleDto) {
    let menus: Pick<Menu, 'id'>[] = [];
    if (role.menus) {
      menus = role.menus.map((menu) => {
        return {
          id: menu,
        };
      });
    }
    return this.roleDao.save({
      ...role,
      menus,
    });
  }
}
