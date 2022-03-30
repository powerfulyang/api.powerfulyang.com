import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@/modules/user/entities/role.entity';
import { SUCCESS } from '@/constants/constants';

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
    if (existedRoles.length) {
      return SUCCESS;
    }
    const roles: Partial<Role>[] = Object.values(Role.IntendedRoles).map((v) => ({
      roleName: v,
    }));
    return this.roleDao.insert(roles);
  }
}
