import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';
import { AppModule } from '@/app.module';
import { SUCCESS } from '@/constants/constants';

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

  it('sync form cos', async function () {
    const res = await service.syncFromCos();
    expect(res).toBe(SUCCESS);
  });
});
