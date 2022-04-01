import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@/modules/user/entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleDao: Repository<Role>,
  ) {}

  getDefaultRole() {
    return this.roleDao.findOneByOrFail({ roleName: Role.IntendedRoles.default });
  }

  async initIntendedRoles() {
    const existedRoles = await this.roleDao.find();
    const roles: Partial<Role>[] = Object.values(Role.IntendedRoles)
      .filter((roleName) => !existedRoles.find((existedRole) => existedRole.roleName === roleName))
      .map((v) => ({
        roleName: v,
      }));
    await this.roleDao.insert(roles);
    return roles;
  }
}
