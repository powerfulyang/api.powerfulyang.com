import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@/modules/user/entities/role.entity.mjs';
import { SUCCESS } from '@/constants/constants.mjs';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    readonly roleDao: Repository<Role>,
  ) {}

  getDefaultRole() {
    return this.roleDao.findOneOrFail({ roleName: Role.IntendedRoles.default });
  }

  async initIntendedRoles() {
    const existedRoles = await this.roleDao.find();
    if (existedRoles.length) {
      return SUCCESS;
    }
    const roles: Partial<Role>[] = Object.values(Role.IntendedRoles).map((v) => ({
      roleName: v,
    }));
    return this.roleDao.insert(roles);
  }
}
