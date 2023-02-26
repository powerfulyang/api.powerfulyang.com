import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@/modules/user/entities/role.entity';
import { Menu } from '@/modules/user/entities/menu.entity';
import type { QueryRolesDto } from '@/modules/user/dto/query-roles.dto';
import { BaseService } from '@/common/service/base/BaseService';
import { LoggerService } from '@/common/logger/logger.service';
import type { CreateRoleDto } from '@/modules/user/dto/create-role.dto';

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
        createAt: this.convertDateRangeToBetween(pagination.createAt),
        updateAt: this.convertDateRangeToBetween(pagination.updateAt),
      },
    });
  }

  queryRoleById(id: string) {
    return this.roleDao.findOneByOrFail({
      id: Number(id),
    });
  }

  updateRoleById(id: string, role: Pick<Role, 'name'>) {
    return this.roleDao.update(id, role);
  }

  deleteRoleById(id: string) {
    return this.roleDao.delete(id);
  }

  createRole(role: CreateRoleDto) {
    return this.roleDao.save(role);
  }
}
