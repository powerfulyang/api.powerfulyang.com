import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@/modules/user/entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    readonly roleDao: Repository<Role>,
  ) {}

  setRoleMenu(role: Role) {
    return this.roleDao.save(role);
  }

  getDefaultRole() {
    return this.roleDao.findOneOrFail({ roleName: 'default' });
  }
}
