import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';
import { AppModule } from '@/app.module';
import { User } from '@/modules/user/entities/user.entity';

describe('AssetService', () => {
  let service: AssetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<AssetService>(AssetService);
  });

  it('deleteAsset', async () => {
    const res = await service.deleteAsset([]);
    expect(res).toBeDefined();
  });

  it('pHashMap', async function () {
    const maps = await service.pHashMap();
    expect(maps).toBeDefined();
  });

  it('update asset uploadBy', async function () {
    const user = new User();
    user.id = 1;
    const res = await service.update(1, {
      uploadBy: user,
    });
    expect(res).toBeDefined();
  });
});
