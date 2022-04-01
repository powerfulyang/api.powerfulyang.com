import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { RoleService } from './role.service';
import { UserModule } from '../user.module';

describe('RoleService', () => {
  let service: RoleService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('init intended roles', async () => {
    const roles = await service.initIntendedRoles();
    expect(roles).toBeDefined();
    const result = await service.getDefaultRole();
    expect(result).toBeDefined();
  });
});
