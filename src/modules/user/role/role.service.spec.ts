import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { AppModule } from '@/app.module';

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('init intended roles', async function () {
    const affected = service.initIntendedRoles();
    expect(affected).toBeDefined();
  });
});
